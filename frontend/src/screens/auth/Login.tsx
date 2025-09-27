import { Connect, useFlowCurrentUser } from "@onflow/react-sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LoginScreen() {
  const { user } = useFlowCurrentUser();
  const navigate = useNavigate();

  // Redirect to dashboard when user is logged in
  useEffect(() => {
    if (user?.loggedIn) {
      navigate("/dashboard");
    }
  }, [user?.loggedIn, navigate]);

  return (
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
  );
}
