export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  description: string;
}

export const mockSubjects: Subject[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "CS",
    description: "Fundamentals of computer science including algorithms, data structures, and programming paradigms."
  },
  {
    id: "2",
    code: "MATH201",
    name: "Calculus II",
    department: "Maths",
    description: "Advanced calculus covering integration techniques, series, and applications in real-world problems."
  },
  {
    id: "3",
    code: "PHYS151",
    name: "Physics: Mechanics and Waves",
    department: "Physics",
    description: "Study of classical mechanics, motion, forces, and wave phenomena with laboratory experiments."
  }
];
