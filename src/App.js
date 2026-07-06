import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/ThemeContext";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { ToastProvider } from "./hooks/ToastContext";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "var(--background)",
      }}>
        <div style={{
          fontSize: "24px",
          fontWeight: 600,
          marginBottom: "16px",
          color: "var(--primary)"
        }}>
          🏥 MediScan AI
        </div>
        <div className="pulse-glow" style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "var(--primary)"
        }} />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// 404 Page
function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "var(--background)",
      textAlign: "center",
      padding: "24px",
      position: "relative",
      zIndex: 10
    }}>
      <h1 style={{ fontSize: "72px", color: "var(--primary)", marginBottom: "12px" }}>404</h1>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Page Not Found</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "400px" }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a href="/" style={{
        padding: "12px 24px",
        background: "var(--primary)",
        color: "white",
        borderRadius: "8px",
        fontWeight: "500",
      }}>Go Back Home</a>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="floating-bg-shapes">
              <div className="shape-1"></div>
              <div className="shape-2"></div>
            </div>
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/analysis/:id" element={<Analysis />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;