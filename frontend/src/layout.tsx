import { Connect, useFlowCurrentUser } from "@onflow/react-sdk";
import { useLocation, useNavigate } from "react-router-dom";

interface AppLayout {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayout) {
  const { user, unauthenticate } = useFlowCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDisconnect = async () => {
    await unauthenticate();
    navigate("/");
  };

  return (
    <div className="mobile-app">
      <div className="flex items-center justify-between p-4">
        {location.pathname !== "/" && <Connect />}
        {user?.loggedIn && (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
