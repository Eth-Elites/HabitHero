import { ethers } from "ethers";
import { useState } from "react";
import { useUserRegistration, type UserData } from "../services/flowService";
import { Button } from "./ui/button";
//@ts-expect-error it exists
import { contract_abi, contract_byte_code } from "../../utils/contract.js";
const { ethereum } = window as {
  ethereum?: { request: (args: { method: string }) => Promise<string[]> };
};
interface UserRegistrationFormProps {
  onRegistrationComplete?: () => void;
  onCancel?: () => void;
}

export function UserRegistrationForm({
  onRegistrationComplete,
}: UserRegistrationFormProps) {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [Address, setAddress] = useState("");

  const { registerUser } = useUserRegistration();
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const _address = accounts[0];
      setAddress(_address);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  async function deployContract(name: string, symbol: string) {
    if (!ethereum) throw new Error("No wallet found");

    try {
      // 1. Connect to MetaMask
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // 2. Prepare the factory with signer
      const factory = new ethers.ContractFactory(
        contract_abi,
        contract_byte_code,
        signer
      );

      // 3. Deploy
      const contract = await factory.deploy(name, symbol);

      // 4. Wait for confirmation
      await contract.waitForDeployment();

      console.log(contract.target, "contract address"); // contract address
    } catch {
      setError("Error deploying contract");
    }
  }
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.gender) {
        throw new Error("Please fill in all fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const transactionId = await registerUser(formData);
      console.log("Registration transaction ID:", transactionId);
      await deployContract(Address, formData.name);

      setSuccess(true);
      setTimeout(() => {
        onRegistrationComplete?.();
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your account has been registered on the Flow blockchain.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Complete Your Registration
      </h2>
      <div className="form-group">
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Connect MetaMask</h3>
          {!Address ? (
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              🦊 Connect MetaMask
            </button>
          ) : (
            <div className="text-green-600">
              <p className="font-medium">✅ Connected to MetaMask</p>
              <p className="text-sm text-gray-600 mt-1">
                Address: {Address.slice(0, 6)}...{Address.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registering..." : "Complete Registration"}
          </Button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This will register your account on the Flow
          testnet blockchain. Make sure you have a Flow wallet connected.
        </p>
      </div>
    </div>
  );
}
