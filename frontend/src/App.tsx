import { Connect, useFlowCurrentUser, useFlowQuery } from "@onflow/react-sdk";

import "./App.css";
function App() {
  const { user } = useFlowCurrentUser();

  const { data: greeting } = useFlowQuery({
    cadence: `access(all) fun main(): String { return "Hello, Flow!" }`,
  });

  return (
    <>
      <h1>Habit Hero</h1>
      <Connect />
      {user?.loggedIn && <p>Welcome, {user.addr}!</p>}
      <p>{typeof greeting === "string" ? greeting : "Loading..."}</p>
    </>
  );
}

export default App;
