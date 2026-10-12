import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "../ui";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading, confirmText = "Delete", variant = "danger" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #0F3C82 0%, #0a1929 60%, #060e1e 100%)",
            }}
          >
            <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-flame-500 to-red-500" />

            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-flame-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-6">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                className="relative w-16 h-16 mx-auto mb-5"
              >
                <div className="absolute inset-0 bg-red-500 rounded-2xl blur-xl opacity-60 animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-flame-600 flex items-center justify-center ring-1 ring-red-300/30 shadow-2xl shadow-red-500/50">
                  <FiAlertTriangle className="text-white text-3xl" />
                </div>
              </motion.div>

              <h3 className="text-xl font-black text-white text-center mb-2 tracking-tight">
                {title || "Are you sure?"}
              </h3>
              <p className="text-sm text-white/60 text-center mb-7 leading-relaxed">
                {message || "This action cannot be undone."}
              </p>

              <div className="flex gap-3">
                <Button variant="ghost" size="md" fullWidth onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button variant={variant} size="md" fullWidth onClick={onConfirm} loading={loading}>
                  {loading ? "Processing..." : confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;