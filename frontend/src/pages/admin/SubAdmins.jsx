import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchSubAdmins,
  updateUserStatus,
  deleteUser,
} from "../../redux/slices/authSlice.js";
import TeacherModal from "../../components/modals/TeacherModal.jsx";
import ConfirmModal from "../../components/modals/ConfirmModal.jsx";
import Loader from "../../components/common/Loader.jsx";
import { Card, Button, Badge, PageHeader, Avatar, EmptyState } from "../../components/ui";
import {
  FiShield, FiPlus, FiCheckCircle, FiXCircle,
  FiMapPin, FiMail, FiToggleLeft, FiToggleRight, FiTrash2,
} from "react-icons/fi";

const SubAdmins = () => {
  const dispatch = useDispatch();
  const { subAdmins, loading } = useSelector((s) => s.auth);

  const [addOpen, setAddOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    dispatch(fetchSubAdmins());
  }, [dispatch]);

  const activeCount = subAdmins.filter((s) => s.isActive).length;
  const inactiveCount = subAdmins.filter((s) => !s.isActive).length;

  const handleToggleStatus = async (id) => {
    setTogglingId(id);
    await dispatch(updateUserStatus(id));
    setTogglingId(null);
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setDeletingId(deleteModal.user._id);
    await dispatch(deleteUser(deleteModal.user._id));
    setDeletingId(null);
    setDeleteModal({ open: false, user: null });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <PageHeader
        title="Sub-Admins"
        subtitle={`${subAdmins.length} branch managers in the system`}
        icon={<FiShield />}
        action={
          <Button
            variant="primary"
            size="md"
            icon={<FiPlus />}
            onClick={() => setAddOpen(true)}
          >
            Add Sub-Admin
          </Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <FiShield />, label: "Total Sub-Admins", value: subAdmins.length, color: "primary", glow: "royal" },
          { icon: <FiCheckCircle />, label: "Active", value: activeCount, color: "success", glow: "emerald" },
          { icon: <FiXCircle />, label: "Inactive", value: inactiveCount, color: "danger", glow: "red" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl p-5 bg-ink-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all"
          >
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${card.glow}-500/15 rounded-full blur-3xl`} />
            <div className="relative flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                  card.color === "success"
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30"
                    : card.color === "danger"
                    ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30"
                    : "bg-gradient-to-br from-royal-500 to-royal-600 shadow-royal-500/30"
                }`}
              >
                {card.icon}
              </div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.18em]">
                {card.label}
              </p>
            </div>
            <p
              className={`relative text-4xl font-black tracking-tight ${
                card.color === "success"
                  ? "text-emerald-300"
                  : card.color === "danger"
                  ? "text-red-300"
                  : "text-royal-300"
              }`}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Sub-Admins List */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black text-white/50 uppercase tracking-widest">
            {subAdmins.length} Branch Managers
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : subAdmins.length === 0 ? (
          <EmptyState
            icon={<FiShield />}
            title="No Sub-Admins Yet"
            description="Add sub-admins to delegate branch management responsibilities."
            action={
              <Button
                variant="primary"
                size="md"
                icon={<FiPlus />}
                onClick={() => setAddOpen(true)}
              >
                Add First Sub-Admin
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {subAdmins.map((subAdmin, idx) => (
              <motion.div
                key={subAdmin._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-royal-400/30 hover:bg-white/[0.05] transition-all"
              >
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Avatar name={subAdmin.name} size="md" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-ink-950 ${
                        subAdmin.isActive ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-white truncate">
                        {subAdmin.name}
                      </p>
                      <Badge
                        variant={subAdmin.isActive ? "success" : "danger"}
                        size="sm"
                      >
                        {subAdmin.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FiMail size={10} className="text-white/40" />
                      <p className="text-[11px] text-white/50 truncate">
                        {subAdmin.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center: Branch Info */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-royal-500/10 border border-royal-400/20 flex-shrink-0">
                  <FiMapPin size={12} className="text-royal-300 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-black text-royal-200">
                      {subAdmin.assignedBranch?.name || "No Branch"}
                    </p>
                    {subAdmin.assignedBranch?.code && (
                      <p className="text-[9px] text-royal-400 font-bold uppercase tracking-widest">
                        {subAdmin.assignedBranch.code}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle Status */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleStatus(subAdmin._id)}
                    disabled={togglingId === subAdmin._id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-50 ${
                      subAdmin.isActive
                        ? "bg-red-500/10 border-red-400/25 text-red-300 hover:bg-red-500/20"
                        : "bg-emerald-500/10 border-emerald-400/25 text-emerald-300 hover:bg-emerald-500/20"
                    }`}
                  >
                    {subAdmin.isActive ? (
                      <>
                        <FiToggleRight size={14} />
                        {togglingId === subAdmin._id ? "..." : "Deactivate"}
                      </>
                    ) : (
                      <>
                        <FiToggleLeft size={14} />
                        {togglingId === subAdmin._id ? "..." : "Activate"}
                      </>
                    )}
                  </motion.button>

                  {/* Delete */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteModal({ open: true, user: subAdmin })}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-400/25 text-red-300 hover:bg-red-500/20 hover:text-white transition-all cursor-pointer"
                  >
                    <FiTrash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Modal — reuse TeacherModal, it now supports sub-admin role */}
      <TeacherModal isOpen={addOpen} onClose={() => setAddOpen(false)} />

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Delete Sub-Admin?"
        message={`Are you sure you want to delete "${deleteModal.user?.name}"? This action cannot be undone.`}
        loading={deletingId === deleteModal.user?._id}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default SubAdmins;