import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Student from "./models/Student.js";
import Fee from "./models/Fee.js";
import Attendance from "./models/Attendance.js";

dotenv.config();

// ========================================
// EXISTING BRANCH ID FROM DATABASE
// ========================================
const BRANCH_ID = new mongoose.Types.ObjectId("6a0981d17607c31f607260d4");

// ========================================
// SEED DATA
// ========================================

// 👤 Users Data (Admin + Teachers)
const usersData = [
  {
    name: "Super Admin",
    email: "mrsolver@admin.com",
    password: "MrSolver@Solve26",
    role: "admin",
    isActive: true,
  },
  {
    name: "Muhammad Abdullah",
    email: "abdullah@mrsolveracademy.com",
    password: "Abdullah@123",
    role: "teacher",
    isActive: true,
  },
  {
    name: "Inam Saed",
    email: "inam@mrsolveracademy.com",
    password: "Inam@123",
    role: "teacher",
    isActive: true,
  },
  {
    name: "Shawkat Siddeqi",
    email: "shawkat@mrsolveracademy.com",
    password: "Shawkat@123",
    role: "teacher",
    isActive: true,
  },
  {
    name: "MR Solver / Amjad Saib",
    email: "amjad@mrsolveracademy.com",
    password: "Amjad@123",
    role: "teacher",
    isActive: true,
  },
];

// 📚 Courses Data
const coursesData = (teacherIds) => [
  {
    branch: BRANCH_ID,
    courseName: "DIT",
    description:
      "Diploma in Information Technology - Complete IT fundamentals and practical skills",
    duration: "6 Months",
    registrationFee: 500,
    advanceFee: 2000,
    monthlyFee: 3000,
    examFee: 1000,
    assignedTeacher: teacherIds[0],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "CIT",
    description:
      "Certificate in Information Technology - Basic IT skills and computer operations",
    duration: "3 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 1500,
    examFee: 500,
    assignedTeacher: teacherIds[0],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Microsoft Office",
    description:
      "Complete Microsoft Office Suite - Word, Excel, PowerPoint, Access and Outlook",
    duration: "2 Months",
    registrationFee: 200,
    advanceFee: 800,
    monthlyFee: 1200,
    examFee: 400,
    assignedTeacher: teacherIds[1],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Graphics Designing",
    description:
      "Professional Graphics Designing - Photoshop, Illustrator and CorelDraw",
    duration: "4 Months",
    registrationFee: 500,
    advanceFee: 1500,
    monthlyFee: 2500,
    examFee: 800,
    assignedTeacher: teacherIds[1],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Video Editing",
    description:
      "Professional Video Editing - Premiere Pro, After Effects and DaVinci Resolve",
    duration: "3 Months",
    registrationFee: 400,
    advanceFee: 1200,
    monthlyFee: 2000,
    examFee: 700,
    assignedTeacher: teacherIds[1],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Cyber Security",
    description:
      "Cyber Security fundamentals - Ethical Hacking, Network Security and Penetration Testing",
    duration: "6 Months",
    registrationFee: 500,
    advanceFee: 2000,
    monthlyFee: 3500,
    examFee: 1000,
    assignedTeacher: teacherIds[2],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "CCNA",
    description:
      "Cisco Certified Network Associate - Network fundamentals, routing and switching",
    duration: "4 Months",
    registrationFee: 500,
    advanceFee: 2000,
    monthlyFee: 3000,
    examFee: 1000,
    assignedTeacher: teacherIds[2],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "CCNP",
    description:
      "Cisco Certified Network Professional - Advanced networking and enterprise infrastructure",
    duration: "6 Months",
    registrationFee: 500,
    advanceFee: 2500,
    monthlyFee: 4000,
    examFee: 1500,
    assignedTeacher: teacherIds[2],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Artificial Intelligence",
    description:
      "Artificial Intelligence and Machine Learning - Python, TensorFlow and Deep Learning",
    duration: "6 Months",
    registrationFee: 500,
    advanceFee: 2500,
    monthlyFee: 4000,
    examFee: 1500,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Digital Marketing",
    description:
      "Complete Digital Marketing - SEO, Social Media Marketing, Google Ads and Analytics",
    duration: "3 Months",
    registrationFee: 400,
    advanceFee: 1200,
    monthlyFee: 2000,
    examFee: 700,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Spoken English",
    description:
      "Spoken English Course - Communication skills, grammar and pronunciation",
    duration: "3 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 1500,
    examFee: 500,
    assignedTeacher: teacherIds[0],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "IELTS",
    description:
      "IELTS Preparation - Reading, Writing, Listening and Speaking modules",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 2000,
    examFee: 500,
    assignedTeacher: teacherIds[0],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "PTE",
    description:
      "PTE Academic Preparation - Complete preparation for Pearson Test of English",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 2000,
    examFee: 500,
    assignedTeacher: teacherIds[0],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "OET",
    description:
      "OET Preparation - Occupational English Test for healthcare professionals",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 2000,
    examFee: 500,
    assignedTeacher: teacherIds[0],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "TOEFL",
    description:
      "TOEFL Preparation - Test of English as a Foreign Language complete preparation",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 2000,
    examFee: 500,
    assignedTeacher: teacherIds[0],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Python",
    description:
      "Python Programming - Basics to Advanced, Data Structures and OOP concepts",
    duration: "4 Months",
    registrationFee: 500,
    advanceFee: 1500,
    monthlyFee: 2500,
    examFee: 800,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "JAVA",
    description:
      "Java Programming - Core Java, OOP, Collections and Spring Framework basics",
    duration: "4 Months",
    registrationFee: 500,
    advanceFee: 1500,
    monthlyFee: 2500,
    examFee: 800,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "C++",
    description:
      "C++ Programming - Fundamentals, Data Structures, OOP and Algorithm Design",
    duration: "4 Months",
    registrationFee: 500,
    advanceFee: 1500,
    monthlyFee: 2500,
    examFee: 800,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "JavaScript",
    description:
      "JavaScript Programming - ES6+, DOM Manipulation, Async JS and frameworks",
    duration: "4 Months",
    registrationFee: 500,
    advanceFee: 1500,
    monthlyFee: 2500,
    examFee: 800,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "WordPress",
    description:
      "WordPress Development - Theme development, plugins and WooCommerce",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 1500,
    examFee: 500,
    assignedTeacher: teacherIds[1],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Web Development",
    description:
      "Complete Web Development - HTML, CSS, JavaScript, React and Node.js",
    duration: "6 Months",
    registrationFee: 500,
    advanceFee: 2000,
    monthlyFee: 3000,
    examFee: 1000,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "E-Commerce",
    description:
      "E-Commerce complete course - Online store setup, management and marketing",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 1500,
    examFee: 500,
    assignedTeacher: teacherIds[1],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Freelancing",
    description:
      "Freelancing Masterclass - Upwork, Fiverr, profile building and client management",
    duration: "1 Month",
    registrationFee: 200,
    advanceFee: 500,
    monthlyFee: 1000,
    examFee: 0,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Trading",
    description:
      "Stock and Forex Trading - Technical analysis, trading strategies and risk management",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 2000,
    examFee: 500,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "Amazon",
    description:
      "Amazon FBA and Selling - Product research, listing optimization and PPC management",
    duration: "2 Months",
    registrationFee: 300,
    advanceFee: 1000,
    monthlyFee: 2000,
    examFee: 500,
    assignedTeacher: teacherIds[3],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "1st Year CS",
    description:
      "1st Year Computer Science - Complete syllabus preparation and practical labs",
    duration: "12 Months",
    registrationFee: 500,
    advanceFee: 2000,
    monthlyFee: 2500,
    examFee: 1000,
    assignedTeacher: teacherIds[2],
    isActive: true,
  },
  {
    branch: BRANCH_ID,
    courseName: "2nd Year CS",
    description:
      "2nd Year Computer Science - Complete syllabus preparation and practical labs",
    duration: "12 Months",
    registrationFee: 500,
    advanceFee: 2000,
    monthlyFee: 2500,
    examFee: 1000,
    assignedTeacher: teacherIds[2],
    isActive: true,
  },
];

// ========================================
// MAIN SEEDER FUNCTION
// ========================================
const seedDatabase = async () => {
  try {
    // ✅ Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!\n");

    console.log("🌱 Starting Database Seeding...\n");

    // ❌ Clear Existing Data (NOT Branch - already exists)
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Student.deleteMany({});
    await Fee.deleteMany({});
    await Attendance.deleteMany({});
    console.log("✅ Existing data cleared!\n");

    // 👤 Create Users (Admin + Teachers)
    console.log("👤 Creating Users...");
    const createdUsers = await User.create(usersData);
    const adminUser = createdUsers.find((u) => u.role === "admin");
    const teachers = createdUsers.filter((u) => u.role === "teacher");
    const teacherIds = teachers.map((t) => t._id);
    console.log(`✅ Created ${createdUsers.length} Users`);
    console.log(`   - 1 Admin`);
    console.log(`   - ${teachers.length} Teachers\n`);

    // 📚 Create Courses
    console.log("📚 Creating Courses...");
    const createdCourses = await Course.create(coursesData(teacherIds));
    console.log(`✅ Created ${createdCourses.length} Courses\n`);

    // ✅ Success Summary
    console.log("========================================");
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("========================================\n");

    console.log("📋 LOGIN CREDENTIALS:");
    console.log("----------------------------------------");
    console.log("🔴 ADMIN LOGIN:");
    console.log("   📧 Email    : mrsolvertechitlearninghub@gmail.com");
    console.log("   🔑 Password : MrSolver@Solve26");
    console.log("----------------------------------------");
    console.log("🟡 TEACHER LOGINS:");
    console.log("   👤 Muhammad Abdullah");
    console.log("   📧 Email    : abdullah@mrsolveracademy.com");
    console.log("   🔑 Password : Abdullah@123");
    console.log("   ----------");
    console.log("   👤 Inam Saed");
    console.log("   📧 Email    : inam@mrsolveracademy.com");
    console.log("   🔑 Password : Inam@123");
    console.log("   ----------");
    console.log("   👤 Shawkat Siddeqi");
    console.log("   📧 Email    : shawkat@mrsolveracademy.com");
    console.log("   🔑 Password : Shawkat@123");
    console.log("   ----------");
    console.log("   👤 MR Solver / Amjad Saib");
    console.log("   📧 Email    : amjad@mrsolveracademy.com");
    console.log("   🔑 Password : Amjad@123");
    console.log("----------------------------------------\n");

    console.log("📊 SEEDED DATA SUMMARY:");
    console.log("----------------------------------------");
    console.log(`   🏢 Branch        : NEXTEP Branch (existing)`);
    console.log(`   👥 Total Users   : ${createdUsers.length}`);
    console.log(`                      - 1 Admin`);
    console.log(`                      - ${teachers.length} Teachers`);
    console.log(`   📚 Total Courses : ${createdCourses.length}`);
    console.log("========================================\n");

    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected!");
    process.exit(0);
  } catch (error) {
    console.log("\n❌ SEEDING FAILED!");
    console.log(`Error: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run Seeder
seedDatabase();