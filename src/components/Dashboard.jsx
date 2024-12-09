import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar, Line, Pie } from "react-chartjs-2";
import IconGym from "../assets/IconGym";
import IconFoodOutline from "../assets/IconFoodOutline";
import IconMentalHealthFill from "../assets/IconMentalHealthFill";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
} from "chart.js";
import { useAuth } from "./AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
  ArcElement
);

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [fitnessData, setFitnessData] = useState(null);
  const [dietData, setDietData] = useState(null);
  const [wellbeingData, setWellbeingData] = useState(null);
  const [todaysLog, setTodaysLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [reportSummary, setReportSummary] = useState([]);
  const { isLoggedIn } = useAuth();

  const [fitnessWeekData, setFitnessWeekData] = useState([]);
  const [dietWeekData, setDietWeekData] = useState([]);
  const [sleepWeekData, setSleepWeekData] = useState([]);

  const fetchUserData = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found in session storage.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9088/user/${userId}/get-details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const data = await response.json();
      setUserInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found in session storage.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [fitnessRes, dietRes, wellbeingRes] = await Promise.all([
        fetch(`http://localhost:9088/health/fitness/${userId}/get-workout`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }),
        fetch(`http://localhost:9088/diet/${userId}/get-diet`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }),
        fetch(`http://localhost:9088/wellbeing/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }),
      ]);

      if (!fitnessRes.ok || !dietRes.ok || !wellbeingRes.ok) {
        throw new Error("Failed to fetch data from one or more services.");
      }

      const [fitnessData, dietData, wellbeingData] = await Promise.all([
        fitnessRes.json(),
        dietRes.json(),
        wellbeingRes.json(),
      ]);

      setFitnessData(fitnessData);
      setDietData(dietData);
      setWellbeingData(wellbeingData);

      const todaysWorkout =
        fitnessData.logs?.[0]?.workout || "No workout logged.";
      const todaysFood = dietData.logs?.[0]?.food || "No meals logged.";
      const todaysMood = wellbeingData.logs?.[0]?.mood || "No mood logged.";

      setTodaysLog({
        workout: todaysWorkout,
        food: todaysFood,
        mood: todaysMood,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found in session storage.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:9088/report/get-report/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch report data: ${response.statusText}`);
      }

      const data = await response.json();

      // Map Fitness Week Data
      setFitnessWeekData(
        data.fitness.map((item) => ({
          date: item.fitnessDate.split("T")[0], // Extract date part (YYYY-MM-DD)
          caloriesBurned: item.totalCaloriesBurned,
        }))
      );

      // Map Diet Week Data
      setDietWeekData(
        data.diet.map((item) => ({
          date: item.dietDate.split("T")[0], 
          caloriesConsumed: item.totalCaloriesConsumed,
        }))
      );

      // Map Sleep Week Data
      setSleepWeekData(
        data.wellbeing.map((item) => ({
          date: item.wellbeingDate, // Already in YYYY-MM-DD format
          sleepHours: item.sleepTime,
          mood: item.mood,
        }))
      );

      setReportSummary([
        {
          CaloriesConsumedWeek: data.finalCaloriesConsumed,
          CaloriesBurnedWeek: data.finalCaloriesBurned,
          Status: data.status,
          UserCalories: data.userCalorie,
        },
      ]);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Failed to load weekly data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchData();
    fetchReportData();
  }, [isLoggedIn]);

  console.log("Fitness Data:", fitnessData);
  console.log("Diet Data:", dietData);
  console.log("Wellbeing Data:", wellbeingData);

  const calculateBMR = () => {
    if (!userInfo) return 0;
    const { weight, height, age, gender } = userInfo;
    if (gender === "Male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const bmr = userInfo ? calculateBMR() : 0;

  const caloriesRequired = userInfo
    ? (() => {
        switch (userInfo.journey) {
          case "Weight Loss":
            return Math.max(1200, bmr * 0.8); // Ensure a safe calorie floor of 1200
          case "Weight Gain":
            return bmr * 1.2;
          case "Maintenance":
          default:
            return bmr;
        }
      })()
    : 0;

  // Prepare data for charts
  const fitnessChartData = {
    labels: fitnessWeekData ? fitnessWeekData.map((data) => data.date) : [],
    datasets: [
      {
        label: "Calories Burned",
        data: fitnessWeekData
          ? fitnessWeekData.map((data) => data.caloriesBurned)
          : [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dietChartData = {
    labels: dietWeekData ? dietWeekData.map((data) => data.date) : [],
    datasets: [
      {
        label: "Calories Consumed",
        data: dietWeekData
          ? dietWeekData.map((data) => data.caloriesConsumed)
          : [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const wellbeingChartData = {
    labels: sleepWeekData ? sleepWeekData.map((data) => data.date) : [],
    datasets: [
      {
        label: "Sleep Hours",
        data: sleepWeekData ? sleepWeekData.map((data) => data.sleepHours) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  console.log("Fitness week Data:", fitnessWeekData);
  console.log("Diet week Data:", dietWeekData);
  console.log("Wellbeing week Data:", sleepWeekData);

  // Check if user details are incomplete
  const isUserDetailsComplete =
    userInfo &&
    userInfo.weight &&
    userInfo.height &&
    userInfo.age &&
    userInfo.gender &&
    userInfo.journey;

  if (!isUserDetailsComplete) {
    return (
      <div className="min-h-screen font-poppins p-8 text-center">
        <h1 className="text-3xl text-Quaternary font-bold mb-4">
          Complete Your Profile
        </h1>
        <p className="text-Secondary text-lg">
          Please update your account details in the{" "}
          <Link
            to="/account"
            className="text-Quaternary font-medium underline hover:text-primary"
          >
            Account Page
          </Link>{" "}
          to access your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-poppins p-8">
      {/* User Info Section */}
      <div className="bg-Grey bg-opacity-40 backdrop-blur-lg text-Secondary p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center">
        {/* User Details */}
        <div className="flex-1">
          <h2 className="text-5xl text-Quaternary font-medium mb-4">
            {userInfo.userName}
          </h2>

          <p className="mb-2">
            <strong className="text-2xl font-medium pr-2">Age:</strong>{" "}
            <span className="text-2xl">{userInfo.age} years</span>
          </p>
          <p className="mb-2">
            <strong className="text-2xl font-medium pr-2">Weight:</strong>
            <span className="text-2xl"> {userInfo.weight} </span>
            kg
          </p>
          <p className="mb-2">
            <strong className="text-2xl font-medium pr-2">Height:</strong>{" "}
            <span className="text-2xl">{userInfo.height} </span>
            cm
          </p>
          <p className="mb-2">
            <strong className="text-2xl font-medium pr-2">Gender:</strong>{" "}
            <span className="text-2xl">{userInfo.gender}</span>
          </p>
          <p className="mb-2">
            <strong className="text-2xl font-medium pr-2">Journey:</strong>{" "}
            <span className="text-2xl text-Quaternary">{userInfo.journey}</span>
          </p>
          <p className="mt-4">
            <strong className="text-2xl font-medium pr-2">
              Maintenance Calories:
            </strong>{" "}
            <span className="text-2xl">{caloriesRequired.toFixed(1)} kcal</span>
          </p>
        </div>
        {/* Calorie Balance Section */}
        <div className="bg-White hover:scale-105 transition bg-Grey bg-opacity-40 backdrop-blur-lg border-2 border-Quaternary p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-4xl font-semibold text-Quaternary mb-2">
            Calorie Balance
          </h3>
          {dietData && fitnessData ? (
            <div className="text-Secondary">
              <p>
                <strong>Total Calories Consumed:</strong>{" "}
                <span className="text-Quaternary">
                  {dietData.totalCaloriesConsumed.toFixed(2)}
                </span>{" "}
                kcal
              </p>
              <p>
                <strong>Total Calories Burned:</strong>{" "}
                <span className="text-Quaternary">
                  {fitnessData.totalCaloriesBurned.toFixed(2)}
                </span>{" "}
                kcal
              </p>
              <p>
                <strong>Net Calories:</strong>{" "}
                <span className="text-Quaternary">
                  {(
                    dietData.totalCaloriesConsumed.toFixed(2) -
                    fitnessData.totalCaloriesBurned.toFixed(2)
                  ).toFixed(2)}
                </span>{" "}
                kcal
              </p>
              <p>
                <strong>Maintenance Calories:</strong>{" "}
                <span className="text-Quaternary">
                  {caloriesRequired.toFixed(1)}
                </span>{" "}
                kcal
              </p>
              <p className="mt-4 ">
                <strong className="text-xl">Result:</strong>{" "}
                {(() => {
                  const netCalories =
                    dietData.totalCaloriesConsumed -
                    fitnessData.totalCaloriesBurned;
                  if (netCalories > caloriesRequired) {
                    return (
                      <span className="text-Quaternary text-xl font-bold">
                        You are in a calorie surplus.{" "}
                        {userInfo.journey === "WEIGHT_LOSS"
                          ? "This may hinder weight loss."
                          : userInfo.journey === "WEIGHT_GAIN"
                          ? "Great for gaining weight!"
                          : "You may gain weight."}
                      </span>
                    );
                  } else if (netCalories < caloriesRequired) {
                    return (
                      <span className="text-Quaternary text-xl font-bold">
                        You are in a calorie deficit.{" "}
                        {userInfo.journey === "WEIGHT_LOSS"
                          ? "This is ideal for weight loss!"
                          : userInfo.journey === "WEIGHT_GAIN"
                          ? "This may hinder weight gain."
                          : "You may lose weight."}
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-Quaternary text-xl font-bold ">
                        You are meeting your maintenance calories.{" "}
                        {userInfo.journey === "WEIGHT_LOSS"
                          ? "Consider reducing your calories for weight loss."
                          : userInfo.journey === "WEIGHT_GAIN"
                          ? "Consider increasing your calories for weight gain."
                          : "You are maintaining your weight."}
                      </span>
                    );
                  }
                })()}
              </p>
            </div>
          ) : (
            <p className="text-Secondary">Calorie data is not available.</p>
          )}
        </div>
      </div>
      {reportSummary && reportSummary.length > 0 ? (
        <>
          <h1 className="text-3xl underline font-semibold mt-6 text-center text-Quaternary mb-8">
            Weekly Report
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fitness Chart */}
            <div className="bg-White hover:scale-105 transition bg-Grey bg-opacity-40 backdrop-blur-lg p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-Quaternary mb-4">
                Weekly Fitness Report
              </h2>
              <Bar data={fitnessChartData} options={{ responsive: true }} />
            </div>

            {/* Diet Chart */}
            <div className="bg-White bg-Grey hover:scale-105 transition bg-opacity-40 backdrop-blur-lg p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-Quaternary mb-4">
                Weekly Diet Report
              </h2>
              <Line data={dietChartData} options={{ responsive: true }} />
            </div>

            {/* Sleep Chart */}
            <div className="bg-White bg-Grey hover:scale-105 transition bg-opacity-40 backdrop-blur-lg p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-Quaternary mb-4">
                Weekly Sleep Report
              </h2>
              <Bar data={wellbeingChartData} options={{ responsive: true }} />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-xl mb-6 text-Grey mt-12">
          No weekly report data available.
        </div>
      )}

      {/* Report Summary Section */}
      {reportSummary && reportSummary.length > 0 && (
        <div className="bg-White bg-Grey bg-opacity-40 mt-7 backdrop-blur-lg border-2 border-Quaternary p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-4xl font-semibold text-Quaternary mb-4">
            Weekly Report Summary
          </h3>
          <ul className="text-Secondary space-y-4">
            {reportSummary.map((summary, index) => (
              <li key={index} className="p-4">
                <p>
                  <strong>Calories Consumed This Week:</strong>{" "}
                  <span className="text-Quaternary">
                    {summary.CaloriesConsumedWeek.toFixed(2)}
                  </span>
                </p>
                <p>
                  <strong>Calories Burned This Week:</strong>{" "}
                  <span className="text-Quaternary">
                    {summary.CaloriesBurnedWeek.toFixed(2)}
                  </span>
                </p>

                <p>
                  <strong>Your Calories:</strong>{" "}
                  <span className="text-Quaternary">
                    {summary.UserCalories.toFixed(2) / 7}
                  </span>{" "}
                  kcal
                </p>
                <p className="text-xl">
                  <strong>Overall Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      summary.Status === "Healthy"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {summary.Status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Today's Activity Section */}
      <div className="grid grid-cols-1 font-poppins md:grid-cols-3 gap-4">
        {/* Fitness Section */}
        <div className="bg-White bg-Grey bg-opacity-40 backdrop-blur-lg border-2 border-Quaternary p-4 rounded-lg shadow-md">
          <h3 className="text-4xl font-semibold text-Quaternary mb-2">
            Fitness Details
          </h3>
          {fitnessData?.workoutList?.length > 0 ? (
            <ul className="text-Secondary">
              {fitnessData.workoutList.map((workout, index) => (
                <li key={index}>
                  <p>
                    <strong>Workout:</strong> {workout.workoutName} (
                    {workout.workoutType})
                  </p>
                  <p>
                    <strong>Calories Burned:</strong>{" "}
                    {workout.caloriesBurned.toFixed(2)} kcal
                  </p>
                </li>
              ))}
              <li className="font-bold text-2xl">
                Total Calories Burned:{" "}
                <span className="text-Quaternary">
                  {fitnessData.totalCaloriesBurned.toFixed(2)}
                </span>{" "}
                kcal
              </li>
            </ul>
          ) : (
            <p className="text-Secondary">No workouts logged today.</p>
          )}
        </div>

        {/* Diet Section */}
        <div className="bg-White bg-Grey bg-opacity-40 backdrop-blur-lg border-2 border-Quaternary p-4 rounded-lg shadow-md">
          <h3 className="text-4xl font-semibold text-Quaternary mb-2">
            Diet Details
          </h3>
          {dietData?.foodList?.length > 0 ? (
            <ul className="text-Secondary">
              {dietData.foodList.map((food, index) => (
                <li key={index}>
                  <p>
                    <strong>Food:</strong> {food.foodName}
                  </p>
                  <p>
                    <strong>Weight:</strong> {food.foodGrams}gm
                  </p>
                  <p>
                    <strong>Protein:</strong> {food.foodProtein}gm
                  </p>
                  <p>
                    <strong>Fats:</strong> {food.foodFat}gm
                  </p>
                  <p>
                    <strong>Calories Consumed:</strong> {food.avgCalories}
                    kcal
                  </p>
                </li>
              ))}
              <li className="font-bold text-2xl">
                Total Calories Consumed:{" "}
                <span className="text-Quaternary">
                  {dietData.totalCaloriesConsumed}{" "}
                </span>
                kcal
              </li>
            </ul>
          ) : (
            <p className="text-Secondary">No meals logged today.</p>
          )}
        </div>

        {/* Wellbeing Section */}
        <div className="bg-White bg-Grey bg-opacity-40 backdrop-blur-lg border-2 border-Quaternary p-4 rounded-lg shadow-md">
          <h3 className="text-4xl font-semibold text-Quaternary mb-2">
            Wellbeing Details
          </h3>
          <p className="text-Secondary">
            <strong>Mood:</strong> {wellbeingData?.mood || "Not logged"}
          </p>
          <p className="text-Secondary">
            <strong>Sleep Time:</strong>{" "}
            {wellbeingData?.sleepTime || "Not logged"} hrs
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
