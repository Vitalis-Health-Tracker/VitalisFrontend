import React, { useState } from "react";

const AddCustomFood = ({ addCustomFood }) => {
  const [foodName, setFoodName] = useState("");
  const [grams, setGrams] = useState("");
  const [caloriesPer100g, setCaloriesPer100g] = useState("");
  const [proteinPer100g, setProteinPer100g] = useState("");
  const [fatPer100g, setFatPer100g] = useState("");

  const handleSubmit = () => {
    if (
      !foodName ||
      !grams ||
      !caloriesPer100g ||
      !proteinPer100g ||
      !fatPer100g
    )
      return;

    const totalCalories =
      (parseFloat(grams) * parseFloat(caloriesPer100g)) / 100;
    const totalProtein = (parseFloat(grams) * parseFloat(proteinPer100g)) / 100;
    const totalFat = (parseFloat(grams) * parseFloat(fatPer100g)) / 100;

    const newFood = {
      name: foodName,
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      fat: Math.round(totalFat),
      grams: parseInt(grams),
    };

    addCustomFood(newFood);
    setFoodName("");
    setGrams("");
    setCaloriesPer100g("");
    setProteinPer100g("");
    setFatPer100g("");
  };

  return (
    <div className="bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Add Custom Food</h3>
      <div className="space-y-4">
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-white bg-transparent"
          placeholder="Enter food name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-white bg-transparent"
          placeholder="Enter weight in grams"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-white bg-transparent"
          placeholder="Enter calories per 100 grams"
          value={caloriesPer100g}
          onChange={(e) => setCaloriesPer100g(e.target.value)}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-white bg-transparent"
          placeholder="Enter protein per 100 grams"
          value={proteinPer100g}
          onChange={(e) => setProteinPer100g(e.target.value)}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-white bg-transparent"
          placeholder="Enter fat per 100 grams"
          value={fatPer100g}
          onChange={(e) => setFatPer100g(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-Quaternary hover:scale-105  text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition"
        >
          Add Custom Food
        </button>
      </div>
    </div>
  );
};

export default AddCustomFood;
