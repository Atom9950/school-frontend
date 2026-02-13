export const GUEST_MODE_KEY = "campusflow_guest_mode";

export function enableGuestMode() {
  localStorage.setItem(GUEST_MODE_KEY, "true");
}

export function disableGuestMode() {
  localStorage.removeItem(GUEST_MODE_KEY);
}

export function isGuestMode(): boolean {
  return localStorage.getItem(GUEST_MODE_KEY) === "true";
}

// Mock data for guest mode
export const MOCK_DATA = {
  classes: [
    {
      id: "1",
      name: "Advanced Python Programming",
      description: "Learn advanced Python concepts and best practices",
      status: "active",
      capacity: 30,
      teacher: { id: "t1", name: "Dr. John Smith" },
      subject: { id: "s1", name: "Computer Science" },
      bannerUrl: null,
      bannerCldPubId: null,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "2",
      name: "Introduction to Web Development",
      description: "Master HTML, CSS, and JavaScript for modern web apps",
      status: "active",
      capacity: 25,
      teacher: { id: "t2", name: "Sarah Johnson" },
      subject: { id: "s2", name: "Web Development" },
      bannerUrl: null,
      bannerCldPubId: null,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-02-12"),
    },
    {
      id: "3",
      name: "Data Science Fundamentals",
      description: "Explore data analysis, visualization, and machine learning basics",
      status: "active",
      capacity: 28,
      teacher: { id: "t3", name: "Prof. Michael Chen" },
      subject: { id: "s3", name: "Data Science" },
      bannerUrl: null,
      bannerCldPubId: null,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-11"),
    },
    {
      id: "4",
      name: "Database Design & SQL",
      description: "Design efficient databases and master SQL queries",
      status: "active",
      capacity: 20,
      teacher: { id: "t1", name: "Dr. John Smith" },
      subject: { id: "s1", name: "Computer Science" },
      bannerUrl: null,
      bannerCldPubId: null,
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-02-13"),
    },
    {
      id: "5",
      name: "Cloud Computing with AWS",
      description: "Deploy and manage applications on Amazon Web Services",
      status: "active",
      capacity: 22,
      teacher: { id: "t2", name: "Sarah Johnson" },
      subject: { id: "s2", name: "Web Development" },
      bannerUrl: null,
      bannerCldPubId: null,
      createdAt: new Date("2024-02-08"),
      updatedAt: new Date("2024-02-14"),
    },
    {
      id: "6",
      name: "Mobile App Development",
      description: "Build native and cross-platform mobile applications",
      status: "inactive",
      capacity: 24,
      teacher: { id: "t3", name: "Prof. Michael Chen" },
      subject: { id: "s3", name: "Data Science" },
      bannerUrl: null,
      bannerCldPubId: null,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-02-09"),
    },
  ],

  subjects: [
    {
      id: "s1",
      name: "Computer Science",
      code: "CS",
      description: "Core computer science concepts and programming",
      departmentId: "d1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "s2",
      name: "Web Development",
      code: "WD",
      description: "Frontend and backend web technologies",
      departmentId: "d1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "s3",
      name: "Data Science",
      code: "DS",
      description: "Data analysis, visualization, and machine learning",
      departmentId: "d2",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "s4",
      name: "Mathematics",
      code: "MATH",
      description: "Advanced mathematics for computer science",
      departmentId: "d1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
  ],

  teachers: [
    {
      id: "t1",
      name: "Dr. John Smith",
      email: "john.smith@school.edu",
      role: "teacher",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "t2",
      name: "Sarah Johnson",
      email: "sarah.johnson@school.edu",
      role: "teacher",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "t3",
      name: "Prof. Michael Chen",
      email: "michael.chen@school.edu",
      role: "teacher",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "t4",
      name: "Dr. Emily Roberts",
      email: "emily.roberts@school.edu",
      role: "teacher",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-02-10"),
    },
  ],

  students: [
    {
      id: "st1",
      name: "Alice Martinez",
      email: "alice.martinez@student.school.edu",
      role: "student",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "st2",
      name: "Bob Wilson",
      email: "bob.wilson@student.school.edu",
      role: "student",
      createdAt: new Date("2024-01-12"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "st3",
      name: "Carol Davis",
      email: "carol.davis@student.school.edu",
      role: "student",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "st4",
      name: "David Brown",
      email: "david.brown@student.school.edu",
      role: "student",
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "st5",
      name: "Emma Taylor",
      email: "emma.taylor@student.school.edu",
      role: "student",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-02-10"),
    },
  ],

  departments: [
    {
      id: "d1",
      name: "School of Computing",
      description: "Computer Science, Software Engineering, and Web Development",
      code: "SOC",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: "d2",
      name: "School of Data Science",
      description: "Data Science and Analytics programs",
      code: "SDS",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-02-10"),
    },
  ],
};
