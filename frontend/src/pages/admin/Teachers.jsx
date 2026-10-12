import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchTeachers } from "../../redux/slices/authSlice.js";
import TeacherTable  from "../../components/tables/TeacherTable.jsx";
import TeacherModal  from "../../components/modals/TeacherModal.jsx";
import Loader        from "../../components/common/Loader.jsx";
import { Card, Button, PageHeader } from "../../components/ui";
import { FiUserPlus, FiUsers, FiCheckCircle, FiXCircle } from "react-icons/fi";

const Teachers = () => {
  const dispatch = useDispatch();
  const { teachers, loading } = useSelector((s) => s.auth);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { dispatch(fetchTeachers()); }, [dispatch]);

  const activeCount   = teachers.filter((t) => t.isActive).length;
  const inactiveCount = teachers.filter((t) => !t.isActive).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <PageHeader
        title="Teachers"
        subtitle={`${teachers.length} staff members in the system`}
        icon={<FiUsers />}
        action={
          <Button variant="primary" size="md" icon={<FiUserPlus />} onClick={() => setAddOpen(true)}>
            Add Teacher
          </Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <FiUsers />,
            label: "Total Staff",
            value: teachers.length,
            color: "primary",
            glow: "royal",
          },
          {
            icon: <FiCheckCircle />,
            label: "Active",
            value: activeCount,
            color: "success",
            glow: "emerald",
          },
          {
            icon: <FiXCircle />,
            label: "Inactive",
            value: inactiveCount,
            color: "danger",
            glow: "red",
          },
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
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg
                ${card.color === "success" ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30" :
                  card.color === "danger"  ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30" :
                  "bg-gradient-to-br from-royal-500 to-royal-600 shadow-royal-500/30"}`}
              >
                {card.icon}
              </div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.18em]">
                {card.label}
              </p>
            </div>
            <p className={`relative text-4xl font-black tracking-tight
              ${card.color === "success" ? "text-emerald-300" :
                card.color === "danger"  ? "text-red-300" : "text-royal-300"}`}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black text-white/50 uppercase tracking-widest">
            {teachers.length} Team Members
          </p>
        </div>
        {loading ? <Loader /> : <TeacherTable teachers={teachers} />}
      </Card>

      <TeacherModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default Teachers;