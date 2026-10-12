import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSubAdminBranch } from "../../redux/slices/branchSlice.js";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  adminAndSubAdmin = false,
  skipBranchCheck = false,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedBranch } = useSelector((state) => state.branches);
  const dispatch = useDispatch();

  // Sub-admin: auto-set their assigned branch as selectedBranch
  useEffect(() => {
    if (user?.role === "sub-admin" && user?.assignedBranch) {
      dispatch(setSubAdminBranch(user.assignedBranch));
    }
  }, [user, dispatch]);

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Admin only routes (teachers & sub-admins blocked)
  if (adminOnly && user.role !== "admin") {
    if (user.role === "sub-admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/attendance" replace />;
  }

  // Admin & Sub-Admin routes (teachers blocked)
  if (adminAndSubAdmin && user.role === "teacher") {
    return <Navigate to="/attendance" replace />;
  }

  // Branch check — skip for sub-admin (they have assignedBranch)
  if (!skipBranchCheck && user.role !== "sub-admin") {
    if (!selectedBranch) {
      return <Navigate to="/select-branch" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;