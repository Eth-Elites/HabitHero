import { ethers } from "ethers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateHabitScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState<
    "Daily" | "Weekly" | "Monthly" | null
  >(null);

  const handleCreateHabit = () => {
    if (habitTitle.trim() && habitDescription.trim() && selectedFrequency) {
      // TODO: Implement habit creation logic
      console.log("Creating habit:", {
        habitTitle,
        habitDescription,
        selectedFrequency,
      });
      // Navigate back to dashboard
      navigate("/dashboard");
    }
  };

  const isFormValid =
    habitTitle.trim() && habitDescription.trim() && selectedFrequency;

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
      <button className="cursor-pointer" onClick={connectWallet}>connect metamask</button>
      <span>Address: {Address} </span>
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
                    onClick={loginEth}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    🦊 Connect MetaMask
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
