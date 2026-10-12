// Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access Denied - Admin Only ❌");
  }
};

// Admin & Sub-Admin Both
const adminAndSubAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "sub-admin")
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Access Denied - Admin or Sub-Admin Only ❌");
  }
};

// Teacher & Admin Both Middleware
const teacherAndAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "teacher" || req.user.role === "admin" || req.user.role === "sub-admin")
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Access Denied ❌");
  }
};

export { adminOnly, adminAndSubAdmin, teacherAndAdmin };