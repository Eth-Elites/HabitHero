import { useFlowCurrentUser } from "@onflow/react-sdk";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//@ts-expect-error it exists
import { useUserRegistration } from "@/services/flowService.js";
//@ts-expect-error it exists
import { contract_abi } from "../../../utils/contract.js";

interface HabitNFT {
  id: string | number;
  title: string;
  description: string;
  streak: number;
  tokenId?: string | number;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RawNFT {
  0?: string; // cid
  1?: string; // description
  2?: string; // title
  3?: string | number | bigint; // streak
  4?: string | number | bigint; // createdAt
  5?: string | number | bigint; // updatedAt
}

export function DashboardScreen() {
  const { user } = useFlowCurrentUser();
  const [activeTab, setActiveTab] = useState("Daily");
  const [habits, setHabits] = useState<HabitNFT[]>([]);
  const [loading, setLoading] = useState(true);

  const { ethereum } = window as {
    ethereum?: { request: (args: { method: string }) => Promise<string[]> };
  };
  const navigate = useNavigate();
  const contractAddress = localStorage.getItem("contract_address");

  const { getUserData } = useUserRegistration();
  const getAllHabits = useCallback(async () => {
    console.log("get al ...............");
    try {
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

      const contract = await getHabitContract();
      if (!contract) {
        throw new Error("Habit contract not initialized");
      }

      // Directly get result (no tx.hash, no tx.wait)
      const nfts = await contract.getAllNFTs();
      console.log("Fetched NFTs (raw):", nfts);

      // Convert proxy to array and extract the actual data
      const nftsArray = Array.from(nfts) as RawNFT[];
      console.log("Fetched NFTs (array):", nftsArray);

      // Extract the actual NFT data from each proxy object
      const extractedNfts: HabitNFT[] = nftsArray.map(
        (nft: RawNFT, index: number) => {
          // Based on the actual data structure:
          // 0: cid (IPFS hash)
          // 1: description
          // 2: title
          // 3: streak
          // 4: createdAt
          // 5: updatedAt
          const nftData: HabitNFT = {
            id: nft[0]?.toString() || index, // cid as id
            title: nft[2] || `Habit ${index + 1}`, // title at index 2
            description: nft[1] || "No description available", // description at index 1
            streak: parseInt(nft[3]?.toString() || "0"), // streak at index 3
            tokenId: nft[0]?.toString() || index, // cid as tokenId
            owner: user?.addr,
            createdAt: nft[4]?.toString(), // createdAt at index 4
            updatedAt: nft[5]?.toString(), // updatedAt at index 5
          };
          console.log(`NFT ${index}:`, nftData);
          return nftData;
        }
      );

      console.log("Extracted NFTs:", extractedNfts);

      // Set the extracted NFTs to state
      setHabits(extractedNfts);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
      setLoading(false);
    }
  }, [user?.addr, contractAddress, ethereum]);

  const completedHabits = habits.filter((habit) => habit.streak > 0).length;
  const totalHabits = habits.length || 1;
  const progressPercentage = (completedHabits / totalHabits) * 100;

  useEffect(() => {
    getAllHabits();
    getUserData();
  }, [getAllHabits]);
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
              setActiveTab("Weekly");
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
          {loading ? (
            <div className="loading-state">
              <p>Loading your habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="empty-state">
              <p>No habits found. Create your first habit!</p>
            </div>
          ) : (
            habits.map((habit) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
