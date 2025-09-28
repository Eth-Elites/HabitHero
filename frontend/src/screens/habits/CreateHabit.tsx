import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabitNFT } from "../../services/flowService";
import {
  ipfsService,
  type IPFSUploadResponse,
} from "../../services/ipfsService";

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
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const { isPending } = useHabitNFT();

  // async function deployContract(name: string, symbol: string) {
  //   if (!ethereum) throw new Error("No wallet found");

  //   try {
  //     // 1. Connect to MetaMask
  //     const provider = new ethers.BrowserProvider(ethereum);
  //     const signer = await provider.getSigner();

  //     // 2. Prepare the factory with signer
  //     const factory = new ethers.ContractFactory(
  //       contract_abi,
  //       contract_byte_code,
  //       signer
  //     );

  //     // 3. Deploy
  //     const contract = await factory.deploy(name, symbol);

  //     // 4. Wait for confirmation
  //     await contract.waitForDeployment();

  //     //@ts-expect-error it exists
  //     setContractAddress(contract.target); // contract address
  //     setCurrentStep(2);
  //   } catch {
  //     setError("Error deploying contract");
  //   }
  // }

  const handleNextStep = async () => {};

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

    try {
      // Upload logo.svg to IPFS
      console.log("Uploading logo.svg to IPFS...");
      const uploadResult: IPFSUploadResponse =
        await ipfsService.uploadImageFromPath("/logo.svg");

      console.log("IPFS upload successful:", uploadResult);
      setIpfsHash(uploadResult.data.hash);
      setIpfsUrl(uploadResult.data.public_url);

      // Here you can add additional logic to create the habit NFT with the IPFS hash
      // For now, we'll just show success
      setSuccess(true);
      console.log("IPFS upload successful:", uploadResult);
    } catch (err) {
      console.error("Error uploading to IPFS:", err);
      setError(
        err instanceof Error ? err.message : "Failed to upload image to IPFS"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = habitTitle.trim();
  const isStep2Valid = habitDescription.trim() && selectedFrequency;

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

            {ipfsHash && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  IPFS Upload Details
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Hash:</strong> {ipfsHash}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Public URL:</strong>
                  <a
                    href={ipfsUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    {ipfsUrl}
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  Logo.svg has been uploaded to IPFS successfully!
                </p>
              </div>
            )}
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
              {isLoading || isPending ? "Uploading to IPFS..." : "Create Habit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
