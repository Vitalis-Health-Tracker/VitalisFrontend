import React, { useState, useEffect } from "react";
import AddCustomWorkout from "./AddCustomWorkout";
import { useNavigate } from "react-router-dom";

// Fetch workout data from API
const fetchWorkoutData = async () => {
  try {
    const response = await fetch(
      "https://sharunraj.github.io/fitnessApi.github.io/FitnessAPI.json"
    );
    const data = await response.json();
    return data.map((workout) => ({
      name: workout.workoutName,
      calories: workout.caloriesBurned,
      id: workout.workoutId,
    }));
  } catch (error) {
    console.error("Error fetching workout data:", error);
    return [];
  }
};

const Fitness = () => {
  const navigate = useNavigate();
  const [workoutOptions, setWorkoutOptions] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [workoutList, setWorkoutList] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const loadWorkoutData = async () => {
      const workouts = await fetchWorkoutData();
      setWorkoutOptions(workouts);
    };
    loadWorkoutData();
  }, []);

  const addWorkout = async () => {
    if (!selectedWorkout || !sets || !reps || !duration) return;

    const workout = workoutOptions.find((w) => w.name === selectedWorkout);
    const caloriesBurned =
      (parseInt(sets) *
        parseInt(reps) *
        workout.calories *
        parseInt(duration)) /
      60; 

    const workoutWithDetails = {
      name: workout.name,
      sets: parseInt(sets),
      reps: parseInt(reps),
      duration: parseInt(duration),
      calories: Math.round(caloriesBurned),
    };

    setWorkoutList([...workoutList, workoutWithDetails]);
    await addEachWorkout(workoutWithDetails);
    setSelectedWorkout("");
    setSets("");
    setReps("");
    setDuration("");
  };

  // Add a custom workout
  const addCustomWorkout = async (customWorkout) => {
    setWorkoutList([...workoutList, customWorkout]);
    const newWorkout = {
      workoutName: customWorkout.name,
      reps: customWorkout.reps,
      duration: customWorkout.duration,
      sets: customWorkout.sets,
      caloriesBurned: customWorkout.calories,
    }
    await addEachCustomWorkout(newWorkout);
  };

  // Calculate total calories whenever workoutList changes
  useEffect(() => {
    const total = workoutList.reduce(
      (sum, workout) => sum + workout.calories,
      0
    );
    setTotalCalories(total);
  }, [workoutList]);

  const addEachWorkout = async (workoutWithDetails) => {
    await fetch(
      `http://localhost:9088/health/fitness/${sessionStorage.getItem(
        "userId"
      )}/add-workout?workoutName=${workoutWithDetails.name}&inputReps=${
        workoutWithDetails.reps
      }&inputSets=${workoutWithDetails.sets}&inputDuration=${
        workoutWithDetails.duration
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
  };

  const addEachCustomWorkout = async (workoutWithDetails) => {
    await fetch(
      `http://localhost:9088/health/fitness/${sessionStorage.getItem("userId")}/add-custom-workout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify(workoutWithDetails)
      }
    );
  };

  const saveFitnessLog = async () => {
    const response = await fetch(
      "http://localhost:9088/health/fitness/" +
        sessionStorage.getItem("userId") +
        "/save-workouts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
    if ((await response.json()) === null) {
      navigate("/bad-request");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen font-poppins py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold underline text-center mb-8 text-Quaternary">
          Daily Workout Tracker
        </h2>

        {/* Main Layout: Two Columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Add Workout and Custom Workout */}
          <div className="flex-1 flex flex-col space-y-8">
            {/* Add Workout Section */}
            <div className="bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-Secondary">
                Add Workout
              </h3>
              <div className="flex flex-col space-y-4">
                <select
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
                  value={selectedWorkout}
                  onChange={(e) => setSelectedWorkout(e.target.value)}
                >
                  <option value="">Select a workout</option>
                  {workoutOptions.map((workout, index) => (
                    <option key={index} value={workout.name}>
                      {workout.name}
                    </option>
                  ))}
                </select>
                {selectedWorkout && (
                  <>
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
                      placeholder="Enter sets"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                    />
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
                      placeholder="Enter reps per set"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                    />
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
                      placeholder="Enter duration in minutes"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </>
                )}
                <button
                  onClick={addWorkout}
                  className="bg-Quaternary hover:scale-105 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Custom Workout Section */}
            <AddCustomWorkout onAddCustomWorkout={addCustomWorkout} />
          </div>

          {/* Right Column: Workout Summary */}
          <div className="flex-1 bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-Secondary">
              Workout Summary
            </h3>
            {workoutList.length === 0 ? (
              <p className="text-gray-500">No workouts added yet.</p>
            ) : (
              <ul className="space-y-4 mb-6">
                {workoutList.map((workout, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 border-b border-gray-200"
                  >
                    <span className="font-medium text-white">
                      {workout.name} ({workout.sets} sets, {workout.reps} reps,{" "}
                      {workout.duration} min)
                    </span>
                    <span className="text-gray-400">
                      {workout.calories} kcal
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Total Summary */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-white">
                Total Calories Burned
              </span>
              <span className="text-lg font-bold text-Quaternary">
                {totalCalories} kcal
              </span>
            </div>

            <button
              onClick={saveFitnessLog}
              className="mt-6 w-full hover:scale-105 bg-Quaternary text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition"
            >
              Save Fitness Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitness;
