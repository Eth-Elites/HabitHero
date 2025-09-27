import { Connect, useFlowCurrentUser } from "@onflow/react-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRegistrationForm } from "../../components/UserRegistrationForm";
import { useUserRegistration } from "../../services/flowService";

export function LoginScreen() {
  const { user } = useFlowCurrentUser();
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const { checkRegistrationStatus } = useUserRegistration();

  // Check registration status when user logs in
  useEffect(() => {
    const checkRegistration = async () => {
      if (user?.loggedIn) {
        setIsCheckingRegistration(true);
        try {
          const isRegistered = await checkRegistrationStatus();
          if (isRegistered) {
            navigate("/dashboard");
          } else {
            setShowRegistration(true);
          }
        } catch (error) {
          console.error("Error checking registration status:", error);
          // If we can't check, assume they need to register
          setShowRegistration(true);
        } finally {
          setIsCheckingRegistration(false);
        }
      }
    };

    checkRegistration();
  }, [user?.loggedIn, navigate, checkRegistrationStatus]);

  const handleRegistrationComplete = () => {
    navigate("/dashboard");
  };

  const handleCancelRegistration = () => {
    setShowRegistration(false);
  };

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

        {showRegistration ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <UserRegistrationForm
              onRegistrationComplete={handleRegistrationComplete}
              onCancel={handleCancelRegistration}
            />
          </div>
        ) : (
          <div className="flex flex-col h-full m-4">
            <Connect />
            {user?.loggedIn && isCheckingRegistration && (
              <div className="welcome-message">
                <p>Checking registration status...</p>
              </div>
            )}
            {user?.loggedIn && !isCheckingRegistration && (
              <div className="welcome-message">
                <p>Welcome, {user.addr}!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
