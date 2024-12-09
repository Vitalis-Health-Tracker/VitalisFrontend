import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom"; 

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("accountInfo");
  const navigate = useNavigate(); 

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState(""); 
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [journey, setJourney] = useState("Maintainance");
  const { logout, isLoggedIn } = useAuth();
  let user = {}

  useEffect(() => {
    const collectDetails = async () => {
    await collectUser();
    }
    collectDetails();
  }, [isLoggedIn]);

  async function collectUser()
  {
    try
    {
      console.log(isLoggedIn)
      await fetch("http://localhost:9088/user/"+sessionStorage.getItem('userId')+"/get-details", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        }
      })
     .then((response) => response.json())
     .then((data) => {
        if(data.userName !== null)
        {
          user = data;
          setUserName(user.userName);
          setEmail(user.email);
          setAge(user.age);
          setGender(user.gender);
          setWeight(user.weight);
          setHeight(user.height);
          setJourney(user.journey);
        }
        else
        {
          setEmail(data.email);
        }
      })
     .catch((error) => {
        console.error("Error occurred while fetching email:", error.message);
        navigate('/bad-request');
      });
    }
    catch (error)
    {
      console.error("Error occurred while fetching email:", error.message);
      navigate('/bad-request');
    }
  }

  async function sendUser(user)
  {
    try
    {
      await fetch("http://localhost:9088/user/"+sessionStorage.getItem('userId'), {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(user)
      })
     .then((response) => response.text())
     .then((data) => {
        if(data !== "User updated successfully")
        {
          navigate('/bad-request');
        }
      })
     .catch((error) => {
        console.error("Error occurred while updating user:", error.message);
        navigate('/bad-request');
      });
    }
    catch (error)
    {
      console.error("Error occurred while updating user:", error.message);
      navigate('/bad-request');
    }
  }

 
  const handleAccountUpdateSubmit = async (e) => {
    e.preventDefault();
    console.log({
      userName,
      age,
      gender,
      weight,
      height,
      journey,
    });
    user.userName = userName;
    user.age = age;
    user.weight = weight;
    user.height = height;
    user.journey = journey;
    user.gender = gender;

    await sendUser(user)

    
    setActiveTab("accountInfo");
  };

  async function deleteUser()
  {
    try
    {
      await fetch("http://localhost:9088/user/"+sessionStorage.getItem('userId'), {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        }
      })
     .then((response) => response.text())
     .then((data) => {
        if(data!== "User deleted successfully")
        {
          navigate('/bad-request');
        }
      })
     .catch((error) => {
        console.error("Error occurred while deleting user:", error.message);
        navigate('/bad-request');
      });
    }
    catch (error)
    {
      console.error("Error occurred while deleting user:", error.message);
      navigate('/bad-request');
    }
  }

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      await deleteUser();
      logout();
      sessionStorage.clear()
      console.log("Account Deleted");
      alert("Account Deleted Successfully");
      navigate('/')
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    logout();
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="w-full p-8 flex flex-col items-center">
        <h1 className="text-3xl text-Secondary font-semibold mb-8">
          Account Settings
        </h1>
        <div className="w-full max-w-3xl p-8 bg-Grey border border-Quaternary bg-opacity-40 backdrop-blur-lg shadow-xl rounded-lg">
          {activeTab === "accountInfo" && (
            <div>
              <h2 className="text-2xl text-Secondary font-semibold mb-6">
                Account Information
              </h2>
              <p className="text-lg text-Secondary">Email: {email}</p>
              <p className="text-lg text-Secondary">Name: {userName}</p>
              <p className="text-lg text-Secondary">Gender: {gender}</p>
              <p className="text-lg text-Secondary">Age: {age}</p>
              <p className="text-lg text-Secondary">Weight: {weight} kg</p>
              <p className="text-lg text-Secondary">Height: {height} cm</p>
              <p className="text-lg text-Secondary">Journey: {journey}</p>

              {/* Update Settings Button */}
              <button
                onClick={() => setActiveTab("updateSettings")}
                className="w-full bg-Quaternary text-white hover:scale-105  font-semibold py-2 rounded-full hover:bg-Quaternary transition mt-6"
              >
                Update Account Information
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-blue-500 hover:scale-105  text-white font-semibold py-2 rounded-full hover:bg-blue-600 transition mt-4"
              >
                Logout
              </button>
              {/* Delete Account Button */}
              <button
                onClick={() => setActiveTab("deleteAccount")}
                className="w-full bg-red-500 hover:scale-105  text-white font-semibold py-2 rounded-full hover:bg-red-600 transition mt-4"
              >
                Delete Account
              </button>
            </div>
          )}

          {activeTab === "updateSettings" && (
            <div>
              <h2 className="text-2xl text-Secondary font-semibold mb-6">
                Update Settings
              </h2>
              <form onSubmit={handleAccountUpdateSubmit}>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-Secondary">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-medium text-Secondary">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your gender"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-medium text-Secondary">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your age"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-medium text-Secondary">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your weight"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-medium text-Secondary">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your height"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-medium text-Secondary">
                    Your Journey
                  </label>
                  <select
                    value={journey}
                    onChange={(e) => setJourney(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="MAINTAIN">Maintainance</option>
                    <option value="WEIGHT_LOSS">WeightLoss</option>
                    <option value="WEIGHT_GAIN">WeightGain</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-Quaternary text-white font-semibold py-2 rounded-md hover:bg-Quaternary transition"
                >
                  Update Information
                </button>
              </form>
            </div>
          )}

          {activeTab === "deleteAccount" && (
            <div>
              <h2 className="text-2xl text-Secondary font-semibold mb-6">
                Delete Account
              </h2>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete My Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
