import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./pages/index1";
import LostAndFound from "./pages/LostAndFound";
import LiveDarshan from "./pages/LiveDarshan";
import ProtectedRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/profile";
import Ticket from "./pages/ticket";
import Density from "./pages/density";
import CrowdDetector from "./pages/CrowdDetector";
import MapPage from "./pages/MapPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.warn("Session expired. Logging out.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        } else {
          console.log("✅ [App] Valid token found, Authenticated.");
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("❌ [App] Invalid token found:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } else {
      console.log("ℹ️ [App] No token found in local storage.");
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Auth setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route path="/live-darshan" element={<LiveDarshan />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/lostFound" element={<LostAndFound />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/dencity" element={<Density />} />
        <Route path="/crowd-detection" element={<CrowdDetector />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
