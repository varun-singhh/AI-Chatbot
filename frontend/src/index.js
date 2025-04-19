import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Chat from "./chat.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Chat />
    </div>
  </React.StrictMode>
);
