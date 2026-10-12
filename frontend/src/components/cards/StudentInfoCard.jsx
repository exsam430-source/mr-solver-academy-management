import { motion } from "framer-motion";
import {
  FiUser, FiPhone, FiMail, FiMapPin, FiBook, FiClock, FiHash,
} from "react-icons/fi";
import { Card, Badge, Avatar } from "../ui";

const SERVER_URL = "http://localhost:5000";

const InfoRow = ({ icon: Icon, label, value, color = "text-royal-300" }) => {
  if (!value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="group flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-flame-400/25 hover:bg-white/[0.05] transition-all"
    >
      <div className={`mt-0.5 w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] text-white/45 uppercase tracking-widest mb-0.5 font-black">{label}</p>
        <p className="text-sm text-white font-semibold break-words">{value}</p>
      </div>
    </motion.div>
  );
};

const StudentInfoCard = ({ student }) => {
  return (
    <Card variant="glass" padding="md" hover={false}>
      {/* Profile */}
      <div className="relative flex flex-col items-center text-center gap-3 pt-2 pb-5 border-b border-white/[0.06]">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-3xl blur-xl opacity-60" />
          {student.photo ? (
            <img
              src={`${SERVER_URL}${student.photo}`}
              alt={student.name}
              className="relative w-28 h-28 rounded-3xl object-cover ring-2 ring-white/15 shadow-2xl"
            />
          ) : (
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center ring-2 ring-white/15 shadow-2xl shadow-flame-500/40">
              <span className="text-4xl font-black text-white">
                {student.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-ink-900 ${
              student.isActive ? "bg-emerald-400" : "bg-red-500"
            } shadow-lg`}
          >
            {student.isActive && (
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-black text-white tracking-tight">{student.name}</h2>
          <div className="mt-2">
            <Badge
              variant={student.isActive ? "success" : "danger"}
              size="sm"
              pulse
            >
              {student.isActive ? "Active Student" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Admission Number */}
      {student.admissionNumber && (
        <div className="my-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-flame-500 to-flame-600 shadow-lg shadow-flame-500/30">
          <FiHash size={14} className="text-white" />
          <span className="text-sm font-black text-white tracking-wider font-mono">
            {student.admissionNumber}
          </span>
        </div>
      )}

      {/* Courses */}
      {student.enrolledCourses?.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-[9px] text-white/50 uppercase tracking-widest font-black px-1">
            Enrolled Courses
          </p>
          <div className="flex flex-wrap gap-1.5">
            {student.enrolledCourses.map((course) => (
              <span
                key={course._id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-flame-500/15 border border-flame-400/25 text-flame-200 text-xs font-bold backdrop-blur-sm"
              >
                <FiBook size={10} />
                {course.courseName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info List */}
      <div className="space-y-2">
        <InfoRow icon={FiUser}    label="Father / Guardian"    value={student.fatherName}        color="text-flame-300" />
        <InfoRow icon={FiUser}    label="Father's Occupation"  value={student.fatherOccupation}  color="text-flame-300" />
        <InfoRow icon={FiMapPin}  label="Domicile"             value={student.domicile}          color="text-cyan-300" />
        <InfoRow icon={FiPhone}   label="Student Contact"      value={student.phone}             color="text-emerald-300" />
        <InfoRow icon={FiPhone}   label="Parent Contact"       value={student.parentPhone}       color="text-emerald-300" />
        <InfoRow icon={FiMail}    label="Email"                value={student.email}             color="text-royal-300" />
        <InfoRow icon={FiHash}    label="CNIC"                 value={student.cnic}              color="text-white/60" />
        <InfoRow icon={FiMapPin}  label="Address"              value={student.address}           color="text-cyan-300" />
        <InfoRow icon={FiBook}    label="Qualification"        value={student.qualification}     color="text-violet-300" />
        <InfoRow icon={FiClock}   label="Class Timings"        value={student.classTimings}      color="text-flame-300" />

        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="mt-0.5 w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60">
            <FiClock size={14} />
          </div>
          <div>
            <p className="text-[9px] text-white/45 uppercase tracking-widest mb-0.5 font-black">
              Registration Date
            </p>
            <p className="text-sm text-white font-semibold">
              {new Date(student.registrationDate).toLocaleDateString("en-PK", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StudentInfoCard;