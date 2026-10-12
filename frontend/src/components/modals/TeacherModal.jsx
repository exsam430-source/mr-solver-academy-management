import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice.js";
import { fetchBranches } from "../../redux/slices/branchSlice.js";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiMapPin } from "react-icons/fi";
import { Modal, Input, Button, Badge } from "../ui";

const TeacherModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { branches } = useSelector((state) => state.branches);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    assignedBranch: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", email: "", password: "", role: "teacher", assignedBranch: "" });
      setShowPassword(false);
      // Fetch branches for sub-admin assignment
      dispatch(fetchBranches());
    }
  }, [isOpen, dispatch]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Only include assignedBranch for sub-admin
    if (formData.role === "sub-admin") {
      payload.assignedBranch = formData.assignedBranch;
    }

    const result = await dispatch(registerUser(payload));
    if (!result.error) onClose();
  };

  const selectClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all cursor-pointer backdrop-blur-sm [color-scheme:dark]";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Member"
      subtitle="Create staff account"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          icon={<FiUser size={14} />}
          required
        />

        <Input
          label="Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@mrsolver.edu.pk"
          icon={<FiMail size={14} />}
          required
        />

        <Input
          label="Password *"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 6 characters"
          icon={<FiLock size={14} />}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/50 hover:text-flame-400 transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          }
          minLength={6}
          required
        />

        {/* Role Selector */}
        <div>
          <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.15em] mb-2">
            Role *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="teacher">Teacher</option>
            <option value="sub-admin">Sub-Admin</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Branch Selector — only for sub-admin */}
        {formData.role === "sub-admin" && (
          <div>
            <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.15em] mb-2">
              Assign Branch *
            </label>
            <select
              name="assignedBranch"
              value={formData.assignedBranch}
              onChange={handleChange}
              required
              className={selectClass}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
            {formData.assignedBranch && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-royal-500/10 border border-royal-400/20">
                <FiMapPin size={12} className="text-royal-300" />
                <span className="text-xs text-royal-200 font-bold">
                  {branches.find((b) => b._id === formData.assignedBranch)?.name}
                </span>
                <Badge variant="primary" size="sm">
                  {branches.find((b) => b._id === formData.assignedBranch)?.code}
                </Badge>
              </div>
            )}
            <p className="text-[10px] text-white/40 mt-2 font-semibold">
              Sub-admin will only have access to students, courses, fees & attendance of this branch.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" size="md" fullWidth onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" fullWidth type="submit" loading={loading}>
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherModal;