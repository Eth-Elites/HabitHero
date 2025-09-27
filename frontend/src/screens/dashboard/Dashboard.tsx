import { useFlowCurrentUser } from "@onflow/react-sdk";

export function DashboardScreen() {
  const { user } = useFlowCurrentUser();

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

  return (
    <div className="dashboard-container">
      {/* User Profile and Progress Section */}
      <div className="profile-card">
        <div className="profile-section">
          <div className="profile-picture">
            <img
              src="https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=🐵"
              alt="Profile"
              className="profile-avatar"
            />
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
          <button className="add-habit-btn">
            <span className="plus-icon">+</span>
            Habit
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button className="nav-tab active">Daily</button>
          <button className="nav-tab">Weekly</button>
          <button className="nav-tab">Monthly</button>
        </div>

        <div className="nav-divider"></div>

        {/* Habits List */}
        <div className="habits-list">
          {habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <div className="habit-content">
                <h3 className="habit-title">{habit.title}</h3>
                <p className="habit-description">{habit.description}</p>
              </div>
              <div className="habit-streak">
                <span className="flame-icon">🔥</span>
                <span className="streak-number">{habit.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
