import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateHabitScreen() {
  const navigate = useNavigate();
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
        <h1 className="create-habit-title">Create Habit</h1>
      </div>

      {/* Form */}
      <div className="create-habit-form">
        {/* Habit Title */}
        <div className="form-group">
          <label className="form-label">Habit Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="Habit name"
            value={habitTitle}
            onChange={(e) => setHabitTitle(e.target.value)}
          />
        </div>

        {/* Habit Description */}
        <div className="form-group">
          <label className="form-label">Habit Description</label>
          <textarea
            className="form-textarea"
            placeholder="Habit description here"
            value={habitDescription}
            onChange={(e) => setHabitDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Streak Reset Options */}
        <div className="form-group">
          <label className="form-label">
            Streak resets if task not completed
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
      </div>

      {/* Create Button */}
      <div className="create-button-container">
        <button
          className={`create-habit-btn ${isFormValid ? "active" : ""}`}
          onClick={handleCreateHabit}
          disabled={!isFormValid}
        >
          Create Habit
        </button>
      </div>
    </div>
  );
}
