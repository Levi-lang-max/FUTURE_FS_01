import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>FUTURE FS 01 🚀</h1>
      <p>SPA Deployment Fixed Successfully</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
