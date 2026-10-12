import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodayAttendance,
  markAttendance,
  fetchAttendanceByCourse,
} from "../../redux/slices/attendanceSlice.js";
import { fetchCourses } from "../../redux/slices/courseSlice.js";
import AttendanceTable from "../../components/tables/AttendanceTable.jsx";
import Loader from "../../components/common/Loader.jsx";
import {
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiUsers,
  FiCheck,
} from "react-icons/fi";

const Attendance = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const { todayData, courseAttendance, loading } = useSelector(
    (state) => state.attendance
  );
  const { user } = useSelector((state) => state.auth);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [viewDate, setViewDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState("mark");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchTodayAttendance(selectedCourse));
    }
  }, [selectedCourse, dispatch]);

  useEffect(() => {
    if (todayData && !todayData.isMarked) {
      const list = todayData.data.map((student) => ({
        student: student._id,
        name: student.name,
        fatherName: student.fatherName,
        status: "present",
      }));
      setAttendanceList(list);
    } else if (todayData?.isMarked) {
      setAttendanceList([]);
    }
  }, [todayData]);

  // ✅ Filter Courses for Teacher
  const filteredCourses = courses.filter((c) => {
    if (user?.role === "admin") return true;
    return (
      c.assignedTeacher?._id === user?._id ||
      c.assignedTeacher === user?._id
    );
  });

  const toggleStatus = (studentId) => {
    setAttendanceList((prev) =>
      prev.map((s) =>
        s.student === studentId
          ? { ...s, status: s.status === "present" ? "absent" : "present" }
          : s
      )
    );
  };

  const handleMarkAll = (status) => {
    setAttendanceList((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSubmit = async () => {
    if (!selectedCourse || attendanceList.length === 0) return;

    const result = await dispatch(
      markAttendance({
        course: selectedCourse,
        date: new Date().toISOString(),
        attendanceData: attendanceList.map((s) => ({
          student: s.student,
          status: s.status,
        })),
      })
    );

    if (!result.error) {
      dispatch(fetchTodayAttendance(selectedCourse));
    }
  };

  const handleViewAttendance = () => {
    if (selectedCourse) {
      dispatch(
        fetchAttendanceByCourse({
          courseId: selectedCourse,
          params: { date: viewDate },
        })
      );
    }
  };

  const presentCount = attendanceList.filter(
    (s) => s.status === "present"
  ).length;
  const absentCount = attendanceList.filter(
    (s) => s.status === "absent"
  ).length;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-txt-primary">Attendance</h1>
        <p className="text-sm text-txt-muted mt-1">
          {new Date().toLocaleDateString("en-PK", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Course Select */}
      <div className="bg-dark-card border border-border-dark rounded-2xl p-4">
        <label className="text-xs font-bold text-txt-secondary uppercase tracking-wider mb-2 block">
          Select Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full bg-dark-input border border-border-dark rounded-xl py-3 px-4 text-txt-primary text-sm outline-none focus:border-primary transition-all"
        >
          <option value="">Choose a course...</option>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName}
              </option>
            ))
          ) : (
            <option disabled>
              {user?.role === "teacher"
                ? "No courses assigned to you"
                : "No courses available"}
            </option>
          )}
        </select>

        {/* Show Message if No Courses for Teacher */}
        {user?.role === "teacher" && filteredCourses.length === 0 && (
          <p className="text-xs text-warning mt-2 flex items-center gap-1.5">
            ⚠️ No courses assigned to you. Contact admin to assign a course.
          </p>
        )}
      </div>

      {selectedCourse && (
        <>
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "mark"
                  ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30"
                  : "bg-dark-card border border-border-dark text-txt-secondary hover:text-primary"
              }`}
            >
              <FiCheckCircle size={14} />
              Mark Attendance
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "view"
                  ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30"
                  : "bg-dark-card border border-border-dark text-txt-secondary hover:text-primary"
              }`}
            >
              <FiCalendar size={14} />
              View Records
            </button>
          </div>

          {/* Mark Attendance Tab */}
          {activeTab === "mark" && (
            <div className="space-y-4">
              {loading ? (
                <Loader />
              ) : todayData?.isMarked ? (
                <div className="bg-success/10 border border-success/20 rounded-2xl p-6 text-center">
                  <FiCheckCircle className="text-success text-4xl mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-success">
                    Attendance Already Marked!
                  </h3>
                  <p className="text-sm text-txt-muted mt-1">
                    Today's attendance has been recorded for this course.
                  </p>
                  <button
                    onClick={() => setActiveTab("view")}
                    className="mt-4 px-4 py-2 rounded-xl bg-success/20 text-success text-sm font-semibold hover:bg-success/30 transition-all cursor-pointer"
                  >
                    View Records
                  </button>
                </div>
              ) : attendanceList.length > 0 ? (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-dark-card border border-border-dark rounded-xl p-3 text-center">
                      <FiUsers className="text-txt-muted mx-auto mb-1" />
                      <p className="text-lg font-black text-txt-primary">
                        {attendanceList.length}
                      </p>
                      <p className="text-xs text-txt-muted">Total</p>
                    </div>
                    <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
                      <FiCheckCircle className="text-success mx-auto mb-1" />
                      <p className="text-lg font-black text-success">
                        {presentCount}
                      </p>
                      <p className="text-xs text-success">Present</p>
                    </div>
                    <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-center">
                      <FiXCircle className="text-danger mx-auto mb-1" />
                      <p className="text-lg font-black text-danger">
                        {absentCount}
                      </p>
                      <p className="text-xs text-danger">Absent</p>
                    </div>
                  </div>

                  {/* Mark All Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAll("present")}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-semibold hover:bg-success/20 transition-all cursor-pointer"
                    >
                      <FiCheckCircle size={12} />
                      Mark All Present
                    </button>
                    <button
                      onClick={() => handleMarkAll("absent")}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold hover:bg-danger/20 transition-all cursor-pointer"
                    >
                      <FiXCircle size={12} />
                      Mark All Absent
                    </button>
                  </div>

                  {/* Student List */}
                  <div className="bg-dark-card border border-border-dark rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 divide-y divide-border-dark">
                      {attendanceList.map((student) => (
                        <div
                          key={student.student}
                          className="flex items-center justify-between p-4 hover:bg-dark-input/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
                                student.status === "present"
                                  ? "bg-success/10 border-success/20 text-success"
                                  : "bg-danger/10 border-danger/20 text-danger"
                              }`}
                            >
                              {student.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-txt-primary">
                                {student.name}
                              </p>
                              <p className="text-xs text-txt-muted">
                                {student.fatherName}
                              </p>
                            </div>
                          </div>

                          {/* Toggle Button */}
                          <button
                            onClick={() => toggleStatus(student.student)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              student.status === "present"
                                ? "bg-success/10 border border-success/20 text-success hover:bg-success/20"
                                : "bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20"
                            }`}
                          >
                            {student.status === "present" ? (
                              <>
                                <FiCheckCircle size={12} />
                                Present
                              </>
                            ) : (
                              <>
                                <FiXCircle size={12} />
                                Absent
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <FiCheck />
                        Submit Attendance
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-txt-muted gap-3 bg-dark-card border border-border-dark rounded-2xl">
                  <FiUsers className="text-4xl opacity-30" />
                  <p className="text-sm font-semibold">No Students Found</p>
                  <p className="text-xs">
                    No students enrolled in this course
                  </p>
                </div>
              )}
            </div>
          )}

          {/* View Records Tab */}
          {activeTab === "view" && (
            <div className="space-y-4">
              <div className="bg-dark-card border border-border-dark rounded-2xl p-4 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[160px]">
                  <label className="text-xs font-bold text-txt-secondary uppercase tracking-wider mb-1.5 block">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={viewDate}
                    onChange={(e) => setViewDate(e.target.value)}
                    className="w-full bg-dark-input border border-border-dark rounded-xl py-2.5 px-4 text-txt-primary text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
                <button
                  onClick={handleViewAttendance}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-light text-sm font-semibold hover:bg-primary/20 transition-all cursor-pointer"
                >
                  <FiCalendar size={14} />
                  View
                </button>
              </div>

              <div className="bg-dark-card border border-border-dark rounded-2xl p-4">
                {loading ? (
                  <Loader />
                ) : (
                  <AttendanceTable records={courseAttendance} />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!selectedCourse && (
        <div className="flex flex-col items-center justify-center py-16 text-txt-muted gap-3 bg-dark-card border border-border-dark rounded-2xl">
          <FiCalendar className="text-5xl opacity-30" />
          <p className="text-base font-semibold">Select a Course</p>
          <p className="text-sm">
            Choose a course to mark or view attendance
          </p>
        </div>
      )}
    </div>
  );
};

export default Attendance;