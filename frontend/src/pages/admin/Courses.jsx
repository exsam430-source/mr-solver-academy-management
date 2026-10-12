import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchCourses } from "../../redux/slices/courseSlice.js";
import CourseCard from "../../components/cards/CourseCard.jsx";
import CourseModal from "../../components/modals/CourseModal.jsx";
import Loader from "../../components/common/Loader.jsx";
import { Card, Button, Badge, EmptyState, PageHeader } from "../../components/ui";
import { FiPlus, FiBook, FiGrid } from "react-icons/fi";

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, count } = useSelector((state) => state.courses);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { dispatch(fetchCourses()); }, [dispatch]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <PageHeader
        title="Courses"
        subtitle={`${count || 0} courses available across all branches`}
        icon={<FiBook />}
        action={
          <Button variant="primary" size="md" icon={<FiPlus />} onClick={() => setAddOpen(true)}>
            Add Course
          </Button>
        }
      />

      {/* Stats pill */}
      {courses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <FiGrid className="text-flame-400" size={14} />
            <span className="text-xs font-black text-white/80">
              {courses.length} Total Courses
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black text-white/80">
              {courses.reduce((sum, c) => sum + (c.studentCount || 0), 0)} Students Enrolled
            </span>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      {loading ? (
        <Loader />
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card variant="glass" padding="lg">
          <EmptyState
            icon={<FiBook />}
            title="No Courses Yet"
            description="Create your first course to start enrolling students and managing curriculum."
            action={
              <Button variant="primary" size="md" icon={<FiPlus />} onClick={() => setAddOpen(true)}>
                Add First Course
              </Button>
            }
          />
        </Card>
      )}

      <CourseModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default Courses;