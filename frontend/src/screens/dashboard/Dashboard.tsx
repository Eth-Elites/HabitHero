import { useFlowCurrentUser } from "@onflow/react-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//@ts-expect-error it exists
import { contract_abi } from "../../../utils/contract.js";

export function DashboardScreen() {
  const { user } = useFlowCurrentUser();
  const [activeTab, setActiveTab] = useState("Daily");

  const { ethereum } = window as {
    ethereum?: { request: (args: { method: string }) => Promise<string[]> };
  };
  const navigate = useNavigate();
  const contractAddress = localStorage.getItem("contract_address");
  const getHabitContract = async () => {
    try {
      console.log("contract_address", contractAddress);
      if (!contractAddress) throw new Error("Contract address not set");
      if (!ethereum) throw new Error("Ethereum object not found");

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      return new ethers.Contract(contractAddress, contract_abi, signer);
    } catch (error) {
      console.error("Failed to get contract:", error);
      return null;
    }
  };
  const getAllHabits = async () => {
  console.log("get al ...............")
  try {
    const contract = await getHabitContract();
    if (!contract) {
      throw new Error("Habit contract not initialized");
    }

    // Directly get result (no tx.hash, no tx.wait)
    const nfts = await contract.getAllNFTs();
    console.log("Fetched NFTs:", nfts);

    // you can now set state
    // setHabits(nfts);
  } catch (error) {
    console.error("Failed to fetch NFTs:", error);
  }
}

  const habits = [
    {
      id: 1,
      title: "Daily Pushups",
      description: "Do 20 pushups every morning.",
      streak: 2,
    },
    {
      id: 2,
      title: "Read 10 Pages",
      description: "Read 10 pages of Alchemist.",
      streak: 4,
    },
    {
      id: 3,
      title: "Code for 30 Minutes",
      description: "Learn cadence.",
      streak: 3,
    },
    {
      id: 4,
      title: "Drink Water",
      description: "Drink 8 glasses of water daily.",
      streak: 7,
    },
    {
      id: 5,
      title: "Daily Meditation",
      description: "Meditation for 5 minutes.",
      streak: 12,
    },
  ];

  const completedHabits = 4;
  const totalHabits = 10;
  const progressPercentage = (completedHabits / totalHabits) * 100;

  // useEffect(() => {
  //   getAllHabits();
  // }, []);
  return (
    <div className="dashboard-container">
      {/* User Profile and Progress Section */}
      <div className="profile-card">
        <div className="profile-section">
          <div className="profile-picture">
            <div className="profile-avatar">
              <span style={{ fontSize: "2rem" }}>🐵</span>
            </div>
          </div>
          <div className="profile-info">
            <h2 className="username">{user?.addr || "yash.eth"}</h2>
            <p className="progress-label">Your Progress</p>
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {completedHabits}/{totalHabits} completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Habits Section */}
      <div className="habits-section">
        <div className="habits-header">
          <h2 className="habits-title">Your Habits</h2>
          <button
            className="add-habit-btn"
            onClick={() => navigate("/create-habit")}
          >
            <span className="plus-icon">+</span>
            Habit
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "Daily" ? "active" : ""}`}
            onClick={() => setActiveTab("Daily")}
          >
            Daily
          </button>
          <button
            className={`nav-tab ${activeTab === "Weekly" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("Weekly")

              getAllHabits()
            }}
          >
            Weekly
          </button>
          <button
            className={`nav-tab ${activeTab === "Monthly" ? "active" : ""}`}
            onClick={() => setActiveTab("Monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Habits List */}
        <div className="habits-list">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="habit-card"
              onClick={() => navigate(`/habit/${habit.id}`)}
            >
              <div className="habit-content">
                <h3 className="habit-title">{habit.title}</h3>
                <p className="habit-description">{habit.description}</p>
              </div>
              <div className="habit-streak">
                <span className="flame-icon">
                  <img src="/flame.svg" alt="flame" />
                </span>
                <span className="streak-number">{habit.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
