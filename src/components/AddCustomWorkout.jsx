import React, { useState } from "react";

const AddCustomWorkout = ({ onAddCustomWorkout }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [sets, setSets] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !workoutName ||
      !reps ||
      !duration ||
      !sets ||
      !caloriesBurned ||
      isNaN(reps) ||
      isNaN(duration) ||
      isNaN(sets) ||
      isNaN(caloriesBurned)
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const customWorkout = {
      name: workoutName,
      reps: parseInt(reps),
      duration: parseInt(duration),
      sets: parseInt(sets),
      calories: parseInt(caloriesBurned),
    };

    // Add the custom workout to the list
    onAddCustomWorkout(customWorkout);

    setWorkoutName("");
    setReps("");
    setDuration("");
    setSets("");
    setCaloriesBurned("");
  };

  return (
    <div className="bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-white">
        Add Custom Workout
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Workout Name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-indigo-500 focus:border-indigo-500 text-white bg-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-indigo-500 focus:border-indigo-500 text-white bg-transparent"
            />
            <input
              type="number"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-indigo-500 focus:border-indigo-500 text-white bg-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-indigo-500 focus:border-indigo-500 text-white bg-transparent"
            />
            <input
              type="number"
              placeholder="Calories Burned"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-indigo-500 focus:border-indigo-500 text-white bg-transparent"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-Quaternary hover:scale-105  text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-500 transition"
            >
              Add Workout
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCustomWorkout;
