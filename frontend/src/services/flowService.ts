import * as fcl from "@onflow/fcl";
import {
  useFlowCurrentUser,
  useFlowMutate,
  useFlowQuery,
} from "@onflow/react-sdk";
import { ethers } from "ethers";
// @ts-expect-error this is a global variable
import { contract_abi, contract_byte_code } from "../../utils/contract.js";
// UserRegV2 contract address on testnet
const USER_REG_CONTRACT = "0x073e2f294371acd0";

// HabitheroNFT contract address on testnet
const HABITHERO_NFT_CONTRACT = "0x073e2f294371acd0";

// Cadence scripts and transactions
const REGISTER_USER_TRANSACTION = `
import UserRegV2 from ${USER_REG_CONTRACT}

transaction(name: String, email: String, gender: String) {
    prepare(acct: &Account) {
        UserRegV2.registerUser(
            addr: acct.address,
            name: name,
            email: email,
            gender: gender
        )
    }
}
`;

const GET_USER_SCRIPT = `
import UserRegV2 from ${USER_REG_CONTRACT}

pub fun main(addr: Address): UserRegV2.User? {
    return UserRegV2.getUser(addr: addr)
}
`;

const MINT_HABIT_NFT_TRANSACTION = `
import HabitheroNFT from ${HABITHERO_NFT_CONTRACT}
import NonFungibleToken from 0x631e88ae7f1d7c20

transaction(cid: String, details: String) {
    prepare(acct: &Account) {
        // Get the user's collection
        let collection = acct.getCapability<&HabitheroNFT.Collection>(/public/HabitheroNFTCollection)
            .borrow() ?? panic("Collection not found")
        
        // Mint the NFT
        HabitheroNFT.admin.mintNFT(recipient: collection, cid: cid, details: details)
    }
}
`;

const GET_NFT_SCRIPT = `
import HabitheroNFT from ${HABITHERO_NFT_CONTRACT}

pub fun main(owner: Address, nftId: UInt64): HabitheroNFT.NFT? {
    let collection = getAccount(owner).getCapability<&HabitheroNFT.Collection>(/public/HabitheroNFTCollection)
        .borrow() ?? return nil
    
    return collection.borrowNFT(id: nftId)
}
`;

export interface UserData {
  name: string;
  email: string;
  gender: string;
}

export interface FlowUser {
  name: string;
  email: string;
  gender: string;
  createdAt: number;
}

export interface HabitData {
  title: string;
  description: string;
  frequency: string;
}

export interface HabitNFT {
  id: number;
  cid: string;
  level: number;
  createdAt: number;
  updatedAt: number;
  details: string;
}

// Note: FlowAccountService methods are now implemented as hooks below

// Hook for user registration using useFlowMutate
export function useUserRegistration() {
  const { user } = useFlowCurrentUser();
  const { mutate, isPending, data: transactionId, error } = useFlowMutate();

  const registerUser = async (userData: UserData) => {
    if (!user?.loggedIn || !user.addr) {
      throw new Error("User must be logged in to register");
    }

    try {
      const result = await mutate({
        cadence: REGISTER_USER_TRANSACTION,
        args: (arg, t) => [
          arg(userData.name, t.String),
          arg(userData.email, t.String),
          arg(userData.gender, t.String),
        ],
      });

      return result;
    } catch (err) {
      console.error("Error registering user:", err);

      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes("User already registered")) {
          throw new Error("This account is already registered");
        } else if (err.message.includes("insufficient")) {
          throw new Error("Insufficient balance to complete transaction");
        } else if (err.message.includes("network")) {
          throw new Error(
            "Network error. Please check your connection and try again"
          );
        }
      }

      throw new Error("Failed to register user. Please try again");
    }
  };

  const checkRegistrationStatus = async () => {
    if (!user?.loggedIn || !user.addr) {
      return false;
    }

    try {
      const result = await fcl.query({
        cadence: GET_USER_SCRIPT,
        args: (arg, t) => [arg(user.addr!, t.Address)],
      });

      return result !== null;
    } catch (error) {
      console.error("Error checking registration status:", error);
      return false;
    }
  };

  const getUserData = async () => {
    if (!user?.loggedIn || !user.addr) {
      return null;
    }

    try {
      const result = await fcl.query({
        cadence: GET_USER_SCRIPT,
        args: (arg, t) => [arg(user.addr!, t.Address)],
      });

      return result;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  return {
    registerUser,
    checkRegistrationStatus,
    getUserData,
    isLoggedIn: user?.loggedIn || false,
    userAddress: user?.addr,
    isPending,
    transactionId,
    error,
  };
}

// Modern hook using useFlowQuery for reactive data fetching
export function useUserData() {
  const { user } = useFlowCurrentUser();

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useFlowQuery({
    cadence: GET_USER_SCRIPT,
    args: (arg: typeof fcl.arg, t: typeof fcl.t) => {
      if (!user?.addr) return [];
      return [arg(user.addr, t.Address)];
    },
    query: {
      enabled: !!user?.addr && !!user?.loggedIn,
      staleTime: 30000, // Cache for 30 seconds
      refetchOnWindowFocus: false,
    },
  });

  return {
    userData: userData as FlowUser | null,
    isLoading,
    error,
    refetch,
    isRegistered: userData !== null && userData !== undefined,
    isLoggedIn: user?.loggedIn || false,
    userAddress: user?.addr,
  };
}

// Hook for habit NFT operations
export function useHabitNFT() {
  const { user } = useFlowCurrentUser();
  const { mutate, isPending, data: transactionId, error } = useFlowMutate();

  const deployNft = async (habitTitle: string) => {
    if (!user?.loggedIn || !user.addr) {
      throw new Error("User must be logged in to deploy NFT");
    }

    try {
      const factory = new ethers.ContractFactory(
        contract_abi,
        contract_byte_code,
        //@ts-expect-error types
        user.addr
      );

      console.log(user.addr, "add");
      const contract = await factory.deploy(habitTitle, habitTitle);
      console.log(contract);
      // For now, use a placeholder CID - in production, you'd upload to IPFS first
      const placeholderCID = `QmPlaceholder${Date.now()}`;

      // Define the details for the NFT
      const details = `Habit: ${habitTitle}`;

      const result = await mutate({
        cadence: MINT_HABIT_NFT_TRANSACTION,
        args: (arg, t) => [
          arg(placeholderCID, t.String),
          arg(details, t.String),
        ],
      });

      return result;
    } catch (err) {
      console.error("Error minting habit NFT:", err);

      if (err instanceof Error) {
        if (err.message.includes("Collection not found")) {
          throw new Error("Please set up your NFT collection first");
        } else if (err.message.includes("insufficient")) {
          throw new Error("Insufficient balance to complete transaction");
        }
      }

      throw new Error("Failed to mint habit NFT. Please try again");
    }
  };

  const getHabitNFT = async (nftId: number) => {
    if (!user?.loggedIn || !user.addr) {
      return null;
    }

    try {
      const result = await fcl.query({
        cadence: GET_NFT_SCRIPT,
        args: (arg, t) => [arg(user.addr!, t.Address), arg(nftId, t.UInt64)],
      });

      return result;
    } catch (error) {
      console.error("Error fetching habit NFT:", error);
      return null;
    }
  };

  return {
    deployNft,
    getHabitNFT,
    isPending,
    transactionId,
    error,
    isLoggedIn: user?.loggedIn || false,
    userAddress: user?.addr,
  };
}
