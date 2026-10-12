import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchBranches, setSelectedBranch } from "../../redux/slices/branchSlice.js";
import { FiMapPin, FiPhone, FiUser, FiArrowRight, FiPlus } from "react-icons/fi";
import Loader from "../../components/common/Loader.jsx";
import { Card, Button, Badge, EmptyState } from "../../components/ui";
import logo from "../../assets/logo.png";

const SelectBranch = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { branches, loading } = useSelector((s) => s.branches);

  useEffect(() => { dispatch(fetchBranches()); }, [dispatch]);

  const handleSelect = (branch) => {
    dispatch(setSelectedBranch(branch));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl relative z-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-3xl blur-2xl opacity-60 animate-pulse" />
            <img
              src={logo}
              alt="MR SOLVER"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ring-4 ring-white/20 shadow-2xl bg-white object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.25em]">
              Select Your Branch
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Choose Your{" "}
            <span className="text-gradient-flame">Branch</span>
          </h1>
          <p className="text-sm text-white/50 font-semibold max-w-md mx-auto">
            Select the branch you want to manage. You can switch branches anytime from the header.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : branches.length === 0 ? (
          <Card variant="glass" padding="lg">
            <EmptyState
              icon={<FiMapPin />}
              title="No Branches Yet"
              description="Create your first branch to get started with the academy management system."
              action={
                <Button
                  variant="primary"
                  size="md"
                  icon={<FiPlus />}
                  onClick={() => navigate("/branches")}
                >
                  Create Branch
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch, idx) => (
              <motion.button
                key={branch._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 260, damping: 22 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(branch)}
                className="group relative overflow-hidden rounded-2xl p-6 text-left bg-ink-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-flame-400/40 hover:shadow-2xl hover:shadow-flame-500/15 transition-all duration-500 cursor-pointer"
              >
                {/* Gradient top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal-500 via-flame-500 to-flame-400" />

                {/* Orbs */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-flame-500/15 rounded-full blur-3xl group-hover:bg-flame-500/30 transition-colors duration-700 pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-royal-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="relative">
                  {/* Icon + Code */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-2xl blur-md opacity-50 group-hover:opacity-90 transition-opacity" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-lg shadow-flame-500/40 ring-1 ring-white/15 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                        <FiMapPin className="text-white text-xl" />
                      </div>
                    </div>
                    <Badge variant="flame" size="sm">{branch.code}</Badge>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-flame-300 transition-colors tracking-tight">
                    {branch.name}
                  </h3>
                  {branch.city && (
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-4">
                      {branch.city}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="space-y-2 mb-5">
                    {branch.phone && (
                      <div className="flex items-center gap-2 text-xs text-white/70 font-semibold px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <FiPhone size={11} className="text-emerald-400 flex-shrink-0" />
                        {branch.phone}
                      </div>
                    )}
                    {branch.manager && (
                      <div className="flex items-center gap-2 text-xs text-white/70 font-semibold px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <FiUser size={11} className="text-flame-400 flex-shrink-0" />
                        {branch.manager}
                      </div>
                    )}
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className="text-xs font-black text-flame-400 uppercase tracking-widest">
                      Select Branch
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-flame-500/15 border border-flame-400/25 flex items-center justify-center group-hover:bg-flame-500 group-hover:border-flame-500 transition-all duration-300">
                      <FiArrowRight
                        className="text-flame-400 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                        size={14}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Add Branch Card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: branches.length * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/branches")}
              className="group flex flex-col items-center justify-center min-h-[280px] rounded-2xl border-2 border-dashed border-white/15 hover:border-flame-400/50 hover:bg-white/[0.02] transition-all cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-flame-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-flame-500/30">
                <FiPlus className="text-white text-2xl" />
              </div>
              <p className="text-sm font-black text-white/60 group-hover:text-white transition-colors">
                Add New Branch
              </p>
              <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest font-bold">
                Manage locations
              </p>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectBranch;