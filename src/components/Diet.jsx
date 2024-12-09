import React, { useState, useEffect } from "react";
import AddCustomFood from "./AddCustomFood";
import { useNavigate } from "react-router-dom";

const fetchFoodData = async () => {
  try {
    const response = await fetch(
      "https://sharunraj.github.io/foodApi.github.io/FoodAPI.json"
    );
    const data = await response.json();
    return data.map((food) => ({
      name: food.foodName,
      caloriesPer100g: food.avgCalories,
      proteinPer100g: food.foodProtein,
      fatPer100g: food.foodFat,
    }));
  } catch (error) {
    console.error("Error fetching food data:", error);
    return [];
  }
};

const Diet = () => {
  const navigate = useNavigate();
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");
  const [grams, setGrams] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0);

  useEffect(() => {
    const loadFoodData = async () => {
      const foods = await fetchFoodData();
      setFoodOptions(foods);
    };
    loadFoodData();
  }, []);

  const addFood = async () => {
    if (!selectedFood || !grams) return;

    const food = foodOptions.find((f) => f.name === selectedFood);
    const calories = (parseFloat(grams) * food.caloriesPer100g) / 100;
    const protein = (parseFloat(grams) * food.proteinPer100g) / 100;
    const fat = (parseFloat(grams) * food.fatPer100g) / 100;

    const foodWithDetails = {
      name: food.name,
      grams: parseInt(grams),
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };

    setFoodList([...foodList, foodWithDetails]);
    await addEachFood(foodWithDetails);
    setSelectedFood("");
    setGrams("");
  };

  const addEachFood = async (foodWithDetails) => {
    await fetch(
      `http://localhost:9088/diet/${sessionStorage.getItem(
        "userId"
      )}/add-food/${foodWithDetails.name}?grams=${foodWithDetails.grams}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const addEachCustomFood = async (customFood) => {
    console.log(customFood);
    await fetch(
      `http://localhost:9088/diet/${sessionStorage.getItem("userId")}/add-custom-food`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(customFood)
      }
    );
  };

  // Add custom food item
  const addCustomFood = async (customFood) => {
    setFoodList([...foodList, customFood]);
    const newFood = {
      foodName: customFood.name,
      foodProtein: customFood.protein,
      foodFat: customFood.fat,
      foodGrams: customFood.grams,
      avgCalories: customFood.calories,
    }
    console.log(newFood)
    await addEachCustomFood(newFood);
  };

  // Calculate totals whenever foodList changes
  useEffect(() => {
    const totalCalories = foodList.reduce(
      (sum, food) => sum + food.calories,
      0
    );
    const totalProtein = foodList.reduce((sum, food) => sum + food.protein, 0);
    const totalFat = foodList.reduce((sum, food) => sum + food.fat, 0);

    setTotalCalories(totalCalories);
    setTotalProtein(totalProtein);
    setTotalFat(totalFat);
  }, [foodList]);

  const saveFoodLog = async () => {
    const response = await fetch(
      `http://localhost:9088/diet/${sessionStorage.getItem(
        "userId"
      )}/save-diet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
        <h2 className="text-3xl underline font-bold text-center mb-8 text-Quaternary">
          Daily Diet Tracker
        </h2>

        {/* Main Layout: Two Columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Add Food and Custom Food */}
          <div className="flex-1 flex flex-col space-y-8">
            {/* Add Food Section */}
            <div className="bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-Secondary">
                Add Food Item
              </h3>
              <div className="flex flex-col space-y-4">
                <select
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
                  value={selectedFood}
                  onChange={(e) => setSelectedFood(e.target.value)}
                >
                  <option value="">Select a food item</option>
                  {foodOptions.map((food, index) => (
                    <option key={index} value={food.name}>
                      {food.name}
                    </option>
                  ))}
                </select>
                {selectedFood && (
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
                    placeholder="Enter weight in grams"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                  />
                )}
                <button
                  onClick={addFood}
                  className="bg-Quaternary hover:scale-105 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Custom Food Section */}
            <AddCustomFood addCustomFood={addCustomFood} />
          </div>

          {/* Right Column: Food Summary */}
          <div className="flex-1 bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Food Summary
            </h3>
            {foodList.length === 0 ? (
              <p className="text-gray-500">No food items added yet.</p>
            ) : (
              <ul className="space-y-4 mb-6">
                {foodList.map((food, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 border-b border-gray-200"
                  >
                    <span className="font-medium text-white">
                      {food.name} ({food.grams}g)
                    </span>
                    <span className="text-gray-400">
                      {food.calories} kcal, {food.protein}g protein, {food.fat}g
                      fat
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Total Summary */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-white">
                Total Calories Consumed
              </span>
              <span className="text-lg font-bold text-Quaternary">
                {totalCalories} kcal
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold text-white">
                Total Protein
              </span>
              <span className="text-lg font-bold text-Quaternary">
                {totalProtein} g
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold text-white">
                Total Fat
              </span>
              <span className="text-lg font-bold text-Quaternary">
                {totalFat} g
              </span>
            </div>
            <button
              onClick={saveFoodLog}
              className="mt-6 w-full hover:scale-105 bg-Quaternary text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition"
            >
              Save Food Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
