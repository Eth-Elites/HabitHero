import { Connect, useFlowCurrentUser } from "@onflow/react-sdk";
import { useEffect, useState } from "react";

interface ConnectWalletButtonProps {
  className?: string;
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const { user } = useFlowCurrentUser();
  const [isConnecting, setIsConnecting] = useState(false);

  // Handle click to initiate connection
  const handleConnectClick = () => {
    if (!user?.loggedIn && !isConnecting) {
      setIsConnecting(true);
    }
  };

  // Reset connecting state when user connects or after timeout
  useEffect(() => {
    if (user?.loggedIn) {
      setIsConnecting(false);
      localStorage.setItem("user_address", user.addr || "");
    } else if (isConnecting) {
      const timeout = setTimeout(() => {
        setIsConnecting(false);
      }, 15000); // 15 second timeout

      return () => clearTimeout(timeout);
    }
  }, [user?.loggedIn, isConnecting]);

  return (
    <div className={`relative ${className}`} onClick={handleConnectClick}>
      <Connect />
      {isConnecting && !user?.loggedIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2 text-white">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <span className="text-sm font-medium">Connecting wallet...</span>
          </div>
        </div>
      )}
    </div>
  );
}
