import { ethers } from "ethers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabitNFT } from "../../services/flowService";
//@ts-expect-error it exists
import { contract_abi, contract_byte_code } from "../../../utils/contract.js";
export function CreateHabitScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState<
    "Daily" | "Weekly" | "Monthly" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const { deployNft, isPending } = useHabitNFT();

  const [Address, setAddress] = useState("")
  const [contractAddress, setContractAddress] = useState()
  const { ethereum } = window as any;
  console.log(ethereum);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  // const deployContract = async (
  //   title: string,
  //   nickName: string
  // ) => {
  //   //@ts-expect-error it exists
  //   const factory = new ethers.ContractFactory(contract_abi, contract_byte_code, Address);
  // const contract = await factory.deploy(title, nickName); // This already waits for deployment
  // //@ts-expect-error it exists
  // setContractAddress(contract.target)
  // }
  async function deployContract(name: string, symbol: string) {
  if (!ethereum) throw new Error("No wallet found");

  // 1. Connect to MetaMask
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  // 2. Prepare the factory with signer
  const factory = new ethers.ContractFactory(contract_abi, contract_byte_code, signer);

  // 3. Deploy
  const contract = await factory.deploy(name, symbol);

  // 4. Wait for confirmation
  await contract.waitForDeployment();

  //@ts-expect-error it exists
  setContractAddress(contract.target); // contract address
}

  const handleNextStep = async () => {
    if (habitTitle.trim()) {
      try {
        const txId = await deployContract(habitTitle, habitTitle)
        console.log("Contract deployed at address:", txId);
      } catch (err) {
        console.error("Error creating habit:", err);
        setError(err instanceof Error ? err.message : "Failed to create habit");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter a habit title");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleCreateHabit = async () => {
    if (!habitTitle.trim() || !habitDescription.trim() || !selectedFrequency) {
      setError("Please fill in all fields before creating the habit");
      return;
    }

    setIsLoading(true);
    setError(null);
  };

  const isStep1Valid = habitTitle.trim();
  const isStep2Valid = habitDescription.trim() && selectedFrequency;
  // --- Check MetaMask accounts
  const checkMetaMaskAccounts = async () => {
    try {
      //@ts-expect-error it exists
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log("All MetaMask accounts:", accounts);
      return accounts;
    } catch (error) {
      console.error("Error getting accounts:", error);
      return [];
    }
  };


  if (success) {
    return (
      <div className="create-habit-container">
        <div className="create-habit-header">
          <h1 className="create-habit-title">Habit Created!</h1>
        </div>
        <div className="create-habit-form">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Habit NFT Minted Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your habit has been created as an NFT on the Flow blockchain.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-habit-container">
      {/* Header */}
      <div className="create-habit-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ←
        </button>
        <div className="flex gap-2 items-center">
          <h1 className="create-habit-title">Create Habit</h1>
          <div className="step-indicator">
            <span className={`step ${currentStep >= 1 ? "active" : ""}`}>
              1
            </span>
            <span className={`step ${currentStep >= 2 ? "active" : ""}`}>
              2
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="create-habit-form">
        {currentStep === 1 && (
          <>
            {/* Step 1: MetaMask Connection */}
            <div className="form-group">
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Connect MetaMask</h3>
                {!ethAddress ? (
                  <button
                    onClick={connectWallet}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    🦊 Connect MetaMask
                    <br/>
                    {Address}
                  </button>

                ) : (
                  <div className="text-green-600">
                    <p className="font-medium">✅ Connected to MetaMask</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Address: {ethAddress.slice(0, 6)}...{ethAddress.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 1: Habit Title */}
            <div className="form-group">
              <label className="form-label">
                What habit would you like to build?
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Drink 8 glasses of water daily"
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                autoFocus
              />
              <span>contract address: {contractAddress} </span>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Step 2: Description and Frequency */}
            <div className="form-group">
              <label className="form-label">Habit Description</label>
              <textarea
                className="form-textarea"
                placeholder="Describe your habit in more detail..."
                value={habitDescription}
                onChange={(e) => setHabitDescription(e.target.value)}
                rows={4}
                autoFocus
              />
            </div>

            {/* Streak Reset Options */}
            <div className="form-group">
              <label className="form-label">
                How often will you do this habit?
              </label>
              <div className="frequency-buttons">
                <button
                  className={`frequency-btn ${
                    selectedFrequency === "Daily" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFrequency("Daily")}
                >
                  Daily
                </button>
                <button
                  className={`frequency-btn ${
                    selectedFrequency === "Weekly" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFrequency("Weekly")}
                >
                  Weekly
                </button>
                <button
                  className={`frequency-btn ${
                    selectedFrequency === "Monthly" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFrequency("Monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="create-button-container">
        {currentStep === 1 ? (
          <button
            className={`create-habit-btn ${isStep1Valid ? "active" : ""}`}
            onClick={handleNextStep}
            disabled={!isStep1Valid}
          >
            Next
          </button>
        ) : (
          <div className="button-group">
            <button
              className="create-habit-btn secondary"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              className={`create-habit-btn ${isStep2Valid ? "active" : ""}`}
              onClick={handleCreateHabit}
              disabled={
                !isStep2Valid || isLoading || isPending || currentStep !== 2
              }
            >
              {isLoading || isPending ? "Minting NFT..." : "Create Habit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}