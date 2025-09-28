import { useFlowCurrentUser } from "@onflow/react-sdk";
import { Navigate } from "react-router-dom";
import { ConnectWalletButton } from "../../components/ConnectWalletButton";

export function LoginScreen() {
  const { user } = useFlowCurrentUser();
  if (user?.addr) return <Navigate to="/registration" />;

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
          <ConnectWalletButton className="connect-content" />
        </div>
      </div>
    </section>
  );
}
