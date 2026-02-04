import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/Create-form";
import FeedbackResponse from "./pages/feedback-response";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public-only routes */}
        <Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/response" element={<FeedbackResponse />}/>
        </Route>

        {/* Protected routes */}
        <Route>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <p className="text-sm">Page not found</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;