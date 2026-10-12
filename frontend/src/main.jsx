import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./redux/store.js";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          style: {
            background: "rgba(10, 25, 41, 0.85)",
            color: "#f1f5f9",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "Inter, sans-serif",
            backdropFilter: "blur(24px)",
            padding: "14px 18px",
            boxShadow:
              "0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#0a1929",
            },
            style: {
              borderLeft: "3px solid #10b981",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0a1929",
            },
            style: {
              borderLeft: "3px solid #ef4444",
            },
          },
          loading: {
            iconTheme: {
              primary: "#F06E23",
              secondary: "#0a1929",
            },
          },
          duration: 3500,
        }}
      />
    </BrowserRouter>
  </Provider>
);