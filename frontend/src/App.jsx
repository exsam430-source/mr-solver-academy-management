import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "./components/common/Sidebar.jsx";
import Header from "./components/common/Header.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Students from "./pages/admin/Students.jsx";
import StudentDetail from "./pages/admin/StudentDetail.jsx";
import Courses from "./pages/admin/Courses.jsx";
import Fees from "./pages/admin/Fees.jsx";
import PendingFees from "./pages/admin/PendingFees.jsx";
import Attendance from "./pages/teacher/Attendance.jsx";
import Teachers from "./pages/admin/Teachers.jsx";
import Reports from "./pages/admin/Reports.jsx";
import MonthlyCollection from "./pages/admin/MonthlyCollection.jsx";
import SelectBranch from "./pages/admin/SelectBranch.jsx";
import Branches from "./pages/admin/Branches.jsx";
import SubAdmins from "./pages/admin/SubAdmins.jsx";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const showShell = user && !isLoginPage;

  // Default redirect based on role
  const getDefaultRoute = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard";
    if (user.role === "sub-admin") return "/dashboard";
    return "/attendance";
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(25, 86, 169, 0.25), transparent 60%), radial-gradient(ellipse 70% 50% at 90% 100%, rgba(240, 110, 35, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(25, 86, 169, 0.12), transparent 60%), #060e1e",
          }}
        />
        <motion.div
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-1/4 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(25, 86, 169, 0.6) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -60, 40, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(240, 110, 35, 0.7) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 35, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[320px]"
          style={{ background: "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)" }}
        />
      </div>

      {/* Layout */}
      <div className="relative z-10 flex min-h-screen">
        {showShell && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

        <div
          className={`flex-1 flex flex-col min-h-screen transition-[padding] duration-500 ${
            showShell ? "lg:pl-[260px]" : ""
          }`}
        >
          {showShell && <Header setIsOpen={setSidebarOpen} />}

          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <Routes location={location}>
                  <Route path="/login" element={<Login />} />

                  {/* ── Admin Only ── */}
                  <Route
                    path="/branches"
                    element={
                      <ProtectedRoute adminOnly skipBranchCheck>
                        <Branches />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/teachers"
                    element={
                      <ProtectedRoute adminOnly>
                        <Teachers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sub-admins"
                    element={
                      <ProtectedRoute adminOnly skipBranchCheck>
                        <SubAdmins />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute adminOnly>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/monthly-collection"
                    element={
                      <ProtectedRoute adminOnly>
                        <MonthlyCollection />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/select-branch"
                    element={
                      <ProtectedRoute adminOnly skipBranchCheck>
                        <SelectBranch />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Admin & Sub-Admin ── */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute adminAndSubAdmin>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/students"
                    element={
                      <ProtectedRoute adminAndSubAdmin>
                        <Students />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/students/:id"
                    element={
                      <ProtectedRoute adminAndSubAdmin>
                        <StudentDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/courses"
                    element={
                      <ProtectedRoute adminAndSubAdmin>
                        <Courses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/fees"
                    element={
                      <ProtectedRoute adminAndSubAdmin>
                        <Fees />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pending-fees"
                    element={
                      <ProtectedRoute adminAndSubAdmin>
                        <PendingFees />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── All Authenticated ── */}
                  <Route
                    path="/attendance"
                    element={
                      <ProtectedRoute>
                        <Attendance />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Redirects ── */}
                  <Route
                    path="/"
                    element={<Navigate to={getDefaultRoute()} replace />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to={getDefaultRoute()} replace />}
                  />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;