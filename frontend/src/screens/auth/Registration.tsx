import { useNavigate } from "react-router-dom";
import { UserRegistrationForm } from "../../components/UserRegistrationForm";

export function RegistrationScreen() {
  const navigate = useNavigate();

  const handleRegistrationComplete = () => {
    navigate("/dashboard");
  };

  return (
    <section className="hero-section">
      <UserRegistrationForm
        onRegistrationComplete={handleRegistrationComplete}
      />
    </section>
  );
}
