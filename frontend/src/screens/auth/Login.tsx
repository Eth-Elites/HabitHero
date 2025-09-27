import { Connect, useFlowCurrentUser } from "@onflow/react-sdk";

export function LoginScreen() {
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
          <div className="flex flex-col h-full m-4">
            <Connect />
            {user?.loggedIn && (
              <div className="welcome-message">
                <p>Welcome, {user.addr}!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
