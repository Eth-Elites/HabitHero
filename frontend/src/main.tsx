import { FlowProvider } from "@onflow/react-sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlowProvider
      config={{
        accessNodeUrl: "https://access-mainnet.onflow.org",
        flowNetwork: "mainnet",
        appDetailTitle: "HabitHero",
        appDetailIcon: "https://example.com/icon.png",
        appDetailDescription: "A decentralized app on Flow",
        appDetailUrl: "https://myonchainapp.com",
      }}
    >
      <App />
    </FlowProvider>
  </StrictMode>
);
