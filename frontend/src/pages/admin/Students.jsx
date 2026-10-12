import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchStudents } from "../../redux/slices/studentSlice.js";
import { fetchCourses } from "../../redux/slices/courseSlice.js";
import StudentTable from "../../components/tables/StudentTable.jsx";
import StudentModal from "../../components/modals/StudentModal.jsx";
import Loader from "../../components/common/Loader.jsx";
import { Card, Button, PageHeader, Badge } from "../../components/ui";
import {
  FiUserPlus, FiSearch, FiFilter, FiX, FiUsers,
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight,
} from "react-icons/fi";

const selectClass =
  "bg-white/[0.04] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all cursor-pointer backdrop-blur-sm [color-scheme:dark]";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Students = () => {
  const dispatch = useDispatch();
  const { students, loading, count } = useSelector((s) => s.students);
  const { courses } = useSelector((s) => s.courses);

  const [addOpen,        setAddOpen]        = useState(false);
  const [search,         setSearch]         = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isActive,       setIsActive]       = useState("");

  // ── Pagination State ──
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize,    setPageSize]    = useState(10);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCourses());
  }, [dispatch]);

  // Reset to page 1 whenever filters change
  const handleSearch = () => {
    const params = {};
    if (search)          params.search   = search;
    if (selectedCourse)  params.course   = selectedCourse;
    if (isActive !== "") params.isActive = isActive;
    dispatch(fetchStudents(params));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch(""); setSelectedCourse(""); setIsActive("");
    dispatch(fetchStudents());
    setCurrentPage(1);
  };

  // ── Pagination Calculations ──
  const totalPages   = Math.ceil(students.length / pageSize);
  const startIndex   = (currentPage - 1) * pageSize;
  const endIndex     = startIndex + pageSize;

  const paginatedStudents = useMemo(
    () => students.slice(startIndex, endIndex),
    [students, startIndex, endIndex]
  );

  // Reset page if students change (e.g. after delete)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [students.length, totalPages, currentPage]);

  const goToPage    = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const goFirst     = ()     => setCurrentPage(1);
  const goLast      = ()     => setCurrentPage(totalPages);
  const goPrev      = ()     => goToPage(currentPage - 1);
  const goNext      = ()     => goToPage(currentPage + 1);

  // ── Page number array with ellipsis ──
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">

      {/* ══════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════ */}
      <PageHeader
        title="Students"
        subtitle={`${count} students enrolled across all courses`}
        icon={<FiUsers />}
        action={
          <Button
            variant="primary"
            size="md"
            icon={<FiUserPlus />}
            onClick={() => setAddOpen(true)}
          >
            Add Student
          </Button>
        }
      />

      {/* ══════════════════════════════════════════
          FILTERS
          ══════════════════════════════════════════ */}
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="text-flame-400" size={14} />
          <p className="text-xs font-black text-white/80 uppercase tracking-widest">
            Search & Filter
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              size={14}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by name, phone, admission no..."
              className={`${selectClass} pl-10 w-full`}
            />
          </div>

          {/* Course Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={`${selectClass} min-w-[160px]`}
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className={selectClass}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <Button variant="primary" size="md" icon={<FiFilter />} onClick={handleSearch}>
            Filter
          </Button>
          <Button variant="ghost" size="md" icon={<FiX />} onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {/* ══════════════════════════════════════════
          TABLE CARD
          ══════════════════════════════════════════ */}
      <Card variant="glass" padding="md">
        {/* Table Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <p className="text-xs font-black text-white/50 uppercase tracking-widest">
              {count} Students
            </p>
            {students.length > 0 && (
              <Badge variant="flame" size="sm">
                Page {currentPage} of {totalPages}
              </Badge>
            )}
          </div>

          {/* Page Size Selector */}
          {students.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Show
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white/[0.04] border border-white/10 rounded-lg py-1.5 px-3 text-white text-xs outline-none focus:border-flame-500 transition-all cursor-pointer [color-scheme:dark]"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                per page
              </span>
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <StudentTable students={paginatedStudents} />
        )}

        {/* ── Pagination Controls ── */}
        {!loading && totalPages > 1 && (
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Info */}
              <p className="text-[11px] text-white/40 font-semibold">
                Showing{" "}
                <span className="text-white/70 font-black">{startIndex + 1}</span>
                {" "}–{" "}
                <span className="text-white/70 font-black">
                  {Math.min(endIndex, students.length)}
                </span>
                {" "}of{" "}
                <span className="text-white/70 font-black">{students.length}</span>
                {" "}students
              </p>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                {/* First */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={goFirst}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="First page"
                >
                  <FiChevronsLeft size={14} />
                </motion.button>

                {/* Prev */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Previous page"
                >
                  <FiChevronLeft size={14} />
                </motion.button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-white/30 text-xs font-black select-none"
                      >
                        …
                      </span>
                    ) : (
                      <motion.button
                        key={page}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => goToPage(page)}
                        className={`min-w-[34px] h-[34px] rounded-lg text-xs font-black transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-lg shadow-flame-500/40 border border-flame-400/50"
                            : "bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                </div>

                {/* Next */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Next page"
                >
                  <FiChevronRight size={14} />
                </motion.button>

                {/* Last */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={goLast}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Last page"
                >
                  <FiChevronsRight size={14} />
                </motion.button>
              </div>

              {/* Jump to Page */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">
                  Go to
                </span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  defaultValue={currentPage}
                  key={currentPage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) goToPage(val);
                    }
                  }}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) goToPage(val);
                  }}
                  className="w-14 bg-white/[0.04] border border-white/10 rounded-lg py-1.5 px-2 text-white text-xs text-center outline-none focus:border-flame-500 transition-all [color-scheme:dark]"
                />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  of {totalPages}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Single page info */}
        {!loading && students.length > 0 && totalPages === 1 && (
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
            <p className="text-[11px] text-white/30 font-semibold">
              Showing all{" "}
              <span className="text-white/60 font-black">{students.length}</span>
              {" "}students
            </p>
          </div>
        )}
      </Card>

      <StudentModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default Students;