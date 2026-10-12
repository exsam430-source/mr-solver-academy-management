import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchBranches, createBranch, updateBranch, deleteBranch,
} from "../../redux/slices/branchSlice.js";
import Loader from "../../components/common/Loader.jsx";
import ConfirmModal from "../../components/modals/ConfirmModal.jsx";
import { Card, Button, Input, Badge, EmptyState, PageHeader } from "../../components/ui";
import {
  FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone,
  FiMail, FiX, FiUser, FiHome,
} from "react-icons/fi";

const INITIAL_FORM = {
  name: "", code: "", address: "", phone: "",
  email: "", city: "", manager: "",
};

const InfoChip = ({ icon: Icon, value, color }) => {
  if (!value) return null;
  const colors = {
    cyan:   "bg-cyan-500/10 border-cyan-400/20 text-cyan-300",
    emerald:"bg-emerald-500/10 border-emerald-400/20 text-emerald-300",
    blue:   "bg-royal-500/10 border-royal-400/20 text-royal-300",
    flame:  "bg-flame-500/10 border-flame-400/20 text-flame-300",
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold backdrop-blur-sm ${colors[color]}`}>
      <Icon size={11} className="flex-shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
};

const Branches = () => {
  const dispatch = useDispatch();
  const { branches, loading } = useSelector((state) => state.branches);

  const [modalOpen, setModalOpen]   = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => { dispatch(fetchBranches()); }, [dispatch]);

  const openCreate = () => {
    setEditBranch(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEdit = (branch) => {
    setEditBranch(branch);
    setForm({
      name: branch.name || "", code: branch.code || "",
      address: branch.address || "", phone: branch.phone || "",
      email: branch.email || "", city: branch.city || "",
      manager: branch.manager || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = editBranch
      ? await dispatch(updateBranch({ id: editBranch._id, branchData: form }))
      : await dispatch(createBranch(form));
    if (!result.error) {
      setModalOpen(false);
      setForm(INITIAL_FORM);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    await dispatch(deleteBranch(deleteTarget));
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <PageHeader
        title="Branches"
        subtitle={`${branches.length} branch${branches.length !== 1 ? "es" : ""} registered`}
        icon={<FiHome />}
        action={
          <Button variant="primary" size="md" icon={<FiPlus />} onClick={openCreate}>
            Add Branch
          </Button>
        }
      />

      {/* Content */}
      {loading ? (
        <Loader />
      ) : branches.length === 0 ? (
        <Card variant="glass" padding="lg">
          <EmptyState
            icon={<FiMapPin />}
            title="No Branches Yet"
            description="Create your first branch to start managing multiple campus locations."
            action={
              <Button variant="primary" size="md" icon={<FiPlus />} onClick={openCreate}>
                Create Branch
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch, idx) => (
            <motion.div
              key={branch._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, type: "spring", stiffness: 260, damping: 22 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] hover:border-flame-400/30 bg-ink-900/60 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-flame-500/10"
            >
              {/* Top gradient stripe */}
              <div className="h-1 bg-gradient-to-r from-royal-500 via-flame-500 to-flame-400" />

              {/* Orbs */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-flame-500/15 rounded-full blur-3xl group-hover:bg-flame-500/25 transition-colors duration-700 pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-royal-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-xl blur-md opacity-50 group-hover:opacity-90 transition-opacity" />
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-lg shadow-flame-500/40 ring-1 ring-white/15 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <FiMapPin className="text-white text-lg" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-white truncate group-hover:text-flame-300 transition-colors">
                        {branch.name}
                      </h3>
                      <Badge variant="flame" size="sm" className="mt-1">
                        {branch.code}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Info chips */}
                <div className="space-y-2 mb-4">
                  <InfoChip icon={FiMapPin} value={branch.city}    color="cyan" />
                  <InfoChip icon={FiPhone}  value={branch.phone}   color="emerald" />
                  <InfoChip icon={FiMail}   value={branch.email}   color="blue" />
                  <InfoChip icon={FiUser}   value={branch.manager} color="flame" />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon={<FiEdit2 />}
                    onClick={() => openEdit(branch)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    icon={<FiTrash2 />}
                    onClick={() => {
                      setDeleteTarget(branch._id);
                      setConfirmOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Branch Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl bg-gradient-to-br from-ink-900 via-[#0b1734] to-ink-950 border border-white/10"
            >
              {/* Top stripe */}
              <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal-500 via-flame-500 to-flame-400" />

              {/* Orbs */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-flame-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-royal-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-flame-500 rounded-xl blur-md opacity-50" />
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-lg shadow-flame-500/40">
                      <FiMapPin className="text-white" size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {editBranch ? "Edit Branch" : "Add New Branch"}
                    </h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-0.5">
                      MR SOLVER Branch Management
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300 transition-all cursor-pointer"
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="relative flex-1 overflow-y-auto px-6 py-5 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Branch Name *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Main Campus"
                    required
                  />
                  <Input
                    label="Branch Code *"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="MAIN"
                    required
                    className="uppercase"
                  />
                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Karachi"
                    icon={<FiMapPin size={14} />}
                  />
                  <Input
                    label="Manager Name"
                    name="manager"
                    value={form.manager}
                    onChange={handleChange}
                    placeholder="Ahmad Khan"
                    icon={<FiUser size={14} />}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03XX-XXXXXXX"
                    icon={<FiPhone size={14} />}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="branch@mrsolver.edu.pk"
                    icon={<FiMail size={14} />}
                  />
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.15em] mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Full branch address..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all placeholder:text-white/30 backdrop-blur-sm resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    type="button"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" fullWidth type="submit">
                    {editBranch ? "Update Branch" : "Create Branch"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Branch?"
        message="Are you sure you want to delete this branch? This action cannot be undone."
      />
    </div>
  );
};

export default Branches;