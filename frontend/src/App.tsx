import { Connect, useFlowCurrentUser } from "@onflow/react-sdk";

import "./App.css";

function App() {
  const { user } = useFlowCurrentUser();

  return (
    <div className="mobile-app">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <img src="/logo.svg" alt="HabitHero Logo" className="logo" />
          </div>
          <h1 className="app-title">HABITHERO</h1>
          <p className="tagline">
            Your intelligent NFT coach for building unstoppable habits
          </p>
        </div>
      </section>

      {/* Separator */}
      <div className="separator"></div>

      {/* Connect Wallet Section */}
      <section className="connect-section">
        <div className="connect-content">
          <Connect />
          {user?.loggedIn && (
            <div className="welcome-message">
              <p>Welcome, {user.addr}!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
