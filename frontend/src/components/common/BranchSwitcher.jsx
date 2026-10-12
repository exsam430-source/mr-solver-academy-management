import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setSelectedBranch } from "../../redux/slices/branchSlice.js";
import { FiMapPin, FiChevronDown, FiCheck, FiHome } from "react-icons/fi";

const BranchSwitcher = () => {
  const dispatch = useDispatch();
  const { branches, selectedBranch } = useSelector((state) => state.branches);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSwitch = (branch) => {
    dispatch(setSelectedBranch(branch));
    setOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-royal-500/10 to-flame-500/10 border border-white/10 hover:border-flame-400/30 transition-all cursor-pointer"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-royal-500 to-flame-500 flex items-center justify-center shadow-md shadow-flame-500/30">
          <FiMapPin className="text-white" size={11} />
        </div>
        <span className="text-[13px] font-bold text-white hidden sm:inline max-w-[120px] truncate">
          {selectedBranch?.name || "Select Branch"}
        </span>
        <FiChevronDown
          size={13}
          className={`text-white/50 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="absolute right-0 top-full mt-2 w-[300px] rounded-2xl overflow-hidden glass-strong border border-white/10 shadow-2xl shadow-black/60 z-50"
          >
            {/* Header */}
            <div className="relative p-4 bg-gradient-to-br from-royal-500/15 via-transparent to-flame-500/15 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <FiHome className="text-flame-400" size={12} />
                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                  Switch Branch
                </p>
              </div>
              <p className="text-[11px] text-white/50 font-medium">
                Choose your active branch location
              </p>
            </div>

            {/* List */}
            <div className="max-h-[320px] overflow-y-auto p-2">
              {branches.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                    <FiMapPin className="text-white/30" />
                  </div>
                  <p className="text-xs text-white/50 font-semibold">No branches available</p>
                </div>
              ) : (
                branches.map((branch, idx) => {
                  const isActive = selectedBranch?._id === branch._id;
                  return (
                    <motion.button
                      key={branch._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => handleSwitch(branch)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer mb-1 ${
                        isActive
                          ? "bg-gradient-to-r from-flame-500/15 to-royal-500/10 border border-flame-400/30 shadow-lg shadow-flame-500/10"
                          : "hover:bg-white/[0.04] border border-transparent hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                            isActive
                              ? "bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-lg shadow-flame-500/40"
                              : "bg-white/5 text-white/60 border border-white/10"
                          }`}
                        >
                          <FiMapPin size={14} />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[13px] font-bold text-white truncate">
                            {branch.name}
                          </p>
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5">
                            {branch.code}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                          <FiCheck className="text-emerald-400" size={12} />
                        </div>
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BranchSwitcher;