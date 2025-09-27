import { FlowProvider } from "@onflow/react-sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import flowJson from "../../backend/flow.json";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlowProvider
      config={{
        accessNodeUrl: "http://localhost:8888",
        flowNetwork: "emulator",
        discoveryWallet: "https://fcl-discovery.onflow.org/emulator/authn",
      }}
      flowJson={flowJson}
    >
      <App />
    </FlowProvider>
  </StrictMode>
);
