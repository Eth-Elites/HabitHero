import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HabitTrackingProps {
  habitTitle?: string;
}

export function HabitTrackingScreen({
  habitTitle = "Daily Pushups",
}: HabitTrackingProps) {
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const handleDayToggle = (dayNumber: number) => {
    setCompletedDays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((day) => day !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const totalDays = 8;
  const completedCount = completedDays.length;

  return (
    <div className="habit-tracking-container">
      {/* Header */}
      <div className="habit-tracking-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="habit-title">{habitTitle}</h1>
      </div>

      {/* Illustration */}
      <div className="habit-illustration">
        <div className="illustration-content">
          <div className="gym-scene">
            <div className="gym-equipment">
              <div className="weight-rack"></div>
              <div className="bike"></div>
              <div className="mirror"></div>
            </div>
            <div className="people">
              <div className="person person-left">
                <div className="person-body yellow-shirt"></div>
                <div className="person-head dark-skin"></div>
                <div className="person-arms"></div>
                <div className="person-legs orange-shorts"></div>
              </div>
              <div className="person person-right">
                <div className="person-body blue-shirt"></div>
                <div className="person-head light-skin"></div>
                <div className="person-arms pointing"></div>
                <div className="person-legs purple-shorts"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="progress-stats">
        <div className="stat">
          <span className="stat-number">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat">
          <span className="stat-number">{totalDays - completedCount}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {Math.round((completedCount / totalDays) * 100)}%
          </span>
          <span className="stat-label">Progress</span>
        </div>
      </div>

      {/* Days List */}
      <div className="days-section">
        <h3 className="section-title">Track Your Progress</h3>
        <div className="days-list">
          {Array.from({ length: totalDays }, (_, index) => {
            const dayNumber = index + 1;
            const isCompleted = completedDays.includes(dayNumber);
            const isFirstDay = dayNumber === 1;

            return (
              <div
                key={dayNumber}
                className={`day-card ${isCompleted ? "completed" : ""}`}
                onClick={() => handleDayToggle(dayNumber)}
              >
                <div className="day-info">
                  <span className="day-number">Day {dayNumber}</span>
                  {isFirstDay && (
                    <div className="challenge-badge">
                      <span className="badge-label">Yash Popli</span>
                      <span className="paper-plane">✈️</span>
                    </div>
                  )}
                </div>
                <div className={`checkbox ${isCompleted ? "checked" : ""}`}>
                  {isCompleted && <span className="checkmark">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Message */}
      {completedCount > 0 && (
        <div className="motivation-message">
          <p>Great job! You're building a strong habit streak! 🔥</p>
        </div>
      )}
    </div>
  );
}
