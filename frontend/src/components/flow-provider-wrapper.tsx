import { FlowProvider } from "@onflow/react-sdk";
import React from "react";
import flowJSON from "../../../backend/flow.json";

const flowNetwork = "testnet" as const;
const flowConfig = {
  emulator: {
    accessNodeUrl: "http://localhost:8888",
    discoveryWallet: "http://localhost:8701/fcl/authn",
    discoveryAuthnEndpoint: "http://localhost:8701/fcl/authn",
    flowNetwork: "local",
  },
  testnet: {
    accessNodeUrl: "https://rest-testnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
    discoveryAuthnEndpoint:
      "https://fcl-discovery.onflow.org/api/testnet/authn",
    flowNetwork: "testnet",
  },
  mainnet: {
    accessNodeUrl: "https://rest-mainnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/mainnet/authn",
    discoveryAuthnEndpoint:
      "https://fcl-discovery.onflow.org/api/mainnet/authn",
    flowNetwork: "mainnet",
  },
};

export default function FlowProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FlowProvider
      //@ts-expect-error types
      config={{
        ...flowConfig[flowNetwork],
        appDetailTitle: "Demo App",
        appDetailUrl: window.location.origin,
        appDetailIcon: "https://avatars.githubusercontent.com/u/62387156?v=4",
        appDetailDescription: "Your app description",
        computeLimit: 1000,
        walletconnectProjectId: "9b70cfa398b2355a5eb9b1cf99f4a981",
      }}
      flowJson={flowJSON}
      colorMode={"dark"}
      // theme={{
      //   colors: {
      //     primary: {
      //       background: "flow-bg-red-700",
      //       text: "flow-text-white",
      //       hover: "hover:flow-bg-green-800",
      //     },
      //     secondary: {
      //       background: "flow-bg-blue-100",
      //       text: "flow-text-blue-800",
      //       hover: "hover:flow-bg-blue-200",
      //     },
      //     outline: {
      //       background: "flow-bg-transparent",
      //       text: "flow-text-blue-700",
      //       hover: "hover:flow-bg-blue-50",
      //       border: "flow-border flow-border-blue-700",
      //     },
      //     link: {
      //       background: "flow-bg-transparent",
      //       text: "flow-text-blue-700",
      //       hover: "hover:flow-bg-blue-50",
      //     },
      //   },
      // }}
    >
      {children}
    </FlowProvider>
  );
}
