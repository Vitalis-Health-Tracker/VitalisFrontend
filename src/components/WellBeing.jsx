import React, { useState } from "react";
import { useNavigate } from "react-router";

const WellBeing = () => {
  const navigate = useNavigate()
  const [sleepHours, setSleepHours] = useState("");
  const [mood, setMood] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const wellbeing = {
    sleepTime: sleepHours,
    mood: mood
  }

  const handleSubmit = async () => {
    if ( await sendWellbeing() === true) {
      setSleepHours("")
      setMood("")
      setSubmitted(true);
    }
  };

  async function sendWellbeing()
  {
    const response = await fetch('http://localhost:9088/wellbeing?userId='+sessionStorage.getItem('userId'),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem('token')
        },
        body: JSON.stringify(wellbeing)
      })
    
    const responseText = await response.text()

    if (responseText === 'Wellbeing Saved' || responseText === 'Wellbeing Updated')
    {
      return true;
    }
    else
    {
      return false;
    }
  }


  
  return (
    <div className="min-h-screen py-10 flex">
      {/* Left side: Content about Mental Health and Sleep */}
      <div className="flex-1 p-10 bg-LightGrey text-Secondary">
        <h2 className="text-4xl font-bold mb-4 italic text-Secondary">
          "A good laugh and a long <span className="text-Quaternary underline">sleep</span> are the best cures in the
          doctor’s book."
        </h2>
        <h2 className="text-4xl font-bold mb-4 italic text-Secondary">
          -Thomas Dekker
        </h2>
        <p className="text-lg mb-4">
          Sleep is vital for our mental and physical well-being. Getting enough
          rest can improve mood, cognitive function, and overall health. A
          proper sleep routine can help manage stress, improve focus, and
          increase energy levels. How are you feeling today, and how was your
          sleep last night?
        </p>
        <p className="text-lg">
          Remember, maintaining a healthy sleep schedule plays a significant
          role in managing mental health. Make sleep a priority, and your mind
          will thank you!
        </p>
      </div>

      {/* Right side: Well-being Tracker Form */}
      <div className="max-w-3xl w-full sm:w-96 mx-auto px-4 sm:px-6 lg:px-8">
        {!submitted ? (
          <div className="bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-6 text-Secondary">
              How are you feeling today?
            </h3>

            {/* Sleep Hours Input */}
            <div className="mb-4">
              <label
                htmlFor="sleepHours"
                className="block text-Secondary text-lg font-medium mb-2"
              >
                How many hours did you sleep last night?
              </label>
              <input
                type="number"
                id="sleepHours"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
                placeholder="Enter hours"
              />
            </div>

            {/* Mood Input */}
            <div className="mb-6">
              <label
                htmlFor="mood"
                className="block text-Secondary text-lg font-medium mb-2"
              >
                How are you feeling today?
              </label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-Quaternary focus:border-Quaternary text-Grey"
              >
                <option value="">Select your mood</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Neutral">Neutral</option>
                <option value="Stressed">Stressed</option>
                <option value="Relaxed">Relaxed</option>
              </select>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-Quaternary text-white font-semibold py-2 rounded-md hover:bg-teal-500 transition"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg text-center p-6 mt-20">
            <h3 className="text-2xl font-semibold text-Secondary mb-4">
              Thank you for sharing!
            </h3>
            <p className="text-lg text-Secondary mb-2">
              You slept {sleepHours} hours last night.
            </p>
            <p className="text-lg text-Secondary">
              You are feeling{" "}
              <span className="font-semibold text-Quaternary">{mood}</span>{" "}
              today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellBeing;
