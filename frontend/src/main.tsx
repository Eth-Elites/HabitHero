import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import FlowProviderWrapper from "./components/flow-provider-wrapper.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlowProviderWrapper>
      <App />
    </FlowProviderWrapper>
  </StrictMode>
);
