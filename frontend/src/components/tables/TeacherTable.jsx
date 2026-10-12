import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { updateUserStatus } from "../../redux/slices/authSlice.js";
import { FiMail, FiToggleLeft, FiToggleRight, FiUser } from "react-icons/fi";
import { Card, Badge, Avatar, EmptyState } from "../ui";

const TeacherTable = ({ teachers }) => {
  const dispatch = useDispatch();

  if (!teachers || teachers.length === 0) {
    return (
      <Card variant="glass" padding="none">
        <EmptyState
          icon={<FiUser />}
          title="No Teachers Found"
          description="Add your first teacher to start managing your academic team."
        />
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-flame-500/10 via-transparent to-royal-500/10 border-b border-white/[0.06]">
              {["Teacher", "Email", "Role", "Status", "Joined", "Action"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-4 text-[10px] font-black text-white/50 uppercase tracking-[0.15em] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, idx) => (
              <motion.tr
                key={teacher._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
              >
                {/* Teacher */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={teacher.name}
                      size="md"
                      status={teacher.isActive ? "online" : "offline"}
                    />
                    <p className="text-sm font-bold text-white group-hover:text-flame-300 transition-colors">
                      {teacher.name}
                    </p>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <FiMail size={11} className="text-royal-300" />
                    </div>
                    <span className="text-sm font-semibold truncate max-w-[200px]">
                      {teacher.email}
                    </span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <Badge
                    variant={teacher.role === "admin" ? "primary" : "flame"}
                    size="md"
                  >
                    {teacher.role}
                  </Badge>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <Badge
                    variant={teacher.isActive ? "success" : "danger"}
                    size="md"
                    pulse={teacher.isActive}
                  >
                    {teacher.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>

                {/* Joined */}
                <td className="px-5 py-4">
                  <p className="text-sm text-white/70 font-semibold">
                    {new Date(teacher.createdAt).toLocaleDateString("en-PK", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => dispatch(updateUserStatus(teacher._id))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      teacher.isActive
                        ? "bg-red-500/10 border-red-400/25 text-red-300 hover:bg-red-500/20 hover:border-red-400/40"
                        : "bg-emerald-500/10 border-emerald-400/25 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/40"
                    }`}
                  >
                    {teacher.isActive ? (
                      <>
                        <FiToggleRight size={14} />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <FiToggleLeft size={14} />
                        Activate
                      </>
                    )}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TeacherTable;