// Smart branch filter:
// - admin        → uses x-branch-id header
// - sub-admin    → uses their assignedBranch (ignore header)
// - others       → blocked

const branchFilter = (req, res, next) => {
  // Sub-admin: force their assigned branch
  if (req.user && req.user.role === "sub-admin") {
    if (!req.user.assignedBranch) {
      res.status(400);
      throw new Error("Sub-admin has no assigned branch ❌");
    }
    req.branchId = req.user.assignedBranch.toString();
    req.branchFilter = { branch: req.user.assignedBranch };
    return next();
  }

  // Admin: uses header
  const branchId = req.headers["x-branch-id"];
  if (!branchId) {
    res.status(400);
    throw new Error("Please select a branch first ❌");
  }

  req.branchId = branchId;
  req.branchFilter = { branch: branchId };
  next();
};

export default branchFilter;