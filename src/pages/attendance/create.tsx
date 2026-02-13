import { useState, useEffect } from "react";
import { useCreate, useList, useNavigation, useBack } from "@refinedev/core";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { GuestActionGuard } from "@/components/guest-action-guard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Department, ClassDetails } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

interface StudentAttendance {
  id: number;
  name: string;
  rollNumber?: string;
  status: "present" | "absent" | "late" | null;
}

const AttendanceCreate = () => {
  const back = useBack();
  const { show, list } = useNavigation();
  const { mutate: createRecord } = useCreate<any>();

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch departments
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100 },
  });

  const departments = departmentsQuery?.data?.data || [];
  const departmentsLoading = departmentsQuery?.isLoading;
  const departmentsError = departmentsQuery?.isError;
  
  useEffect(() => {
    console.log("Departments Query:", departmentsQuery);
    console.log("Departments List:", departments);
  }, [departments, departmentsLoading]);

  // Fetch classes
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { pageSize: 100 },
  });

  const allClasses = classesQuery?.data?.data || [];
  const classesLoading = classesQuery?.isLoading;

  // Filter classes by selected department
  const filteredClasses = selectedDepartment
    ? allClasses.filter(
        (cls) => cls.department?.id === Number(selectedDepartment)
      )
    : [];

  // Fetch students for selected department
  useEffect(() => {
    console.log("Selected Department changed to:", selectedDepartment);
    
    if (!selectedDepartment) {
      console.log("No department selected, clearing students");
      setStudents([]);
      setSelectedClass("");
      return;
    }

    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const baseUrl = BACKEND_BASE_URL.endsWith("/")
          ? BACKEND_BASE_URL.slice(0, -1)
          : BACKEND_BASE_URL;
        const url = `${baseUrl}/students?departmentId=${selectedDepartment}&page=1&limit=500`;
        console.log("Fetching students from URL:", url);
        
        const response = await fetch(url);
        console.log("Response status:", response.status);
        
        const data = await response.json();
        console.log("Response data:", data);
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch students");
        }

        const studentList = (data.data || []).map((student: any) => ({
          id: student.id,
          name: student.name,
          rollNumber: student.rollNumber,
          status: null as "present" | "absent" | "late" | null,
        }));
        console.log("Processed student list:", studentList);
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedDepartment]);

  const handleStatusChange = (
    studentId: number,
    status: "present" | "absent" | "late"
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const markedStudents = students.filter((s) => s.status !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass || !attendanceDate) {
      alert("Please select a class and date");
      return;
    }

    if (markedStudents.length === 0) {
      alert("Please mark attendance for at least one student");
      return;
    }

    const records = markedStudents.map((student) => ({
      classId: Number(selectedClass),
      studentId: student.id,
      date: attendanceDate,
      status: student.status,
    }));

    setIsSaving(true);
    createRecord(
      {
        resource: "attendance",
        values: { records },
        meta: {
          method: "post",
          url: "attendance/bulk",
        },
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          list("attendance");
        },
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  };

  return (
    <GuestActionGuard action="create">
      <CreateView className="attendance-view">
        <Breadcrumb />

      <h1 className="page-title">Mark Attendance</h1>
      <div className="intro-row">
        <p>Mark student attendance by department and class.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="attendance-form-card w-full">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Attendance Form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Department Selection */}
              <div>
                <label className="text-sm font-medium">
                  Department <span className="text-orange-600">*</span>
                </label>
                {departmentsLoading ? (
                  <div className="border-2 border-primary rounded-md p-2 mt-1 flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Loading departments...
                  </div>
                ) : departmentsError ? (
                  <div className="border-2 border-destructive rounded-md p-2 mt-1 text-destructive">
                    Error loading departments
                  </div>
                ) : departments.length === 0 ? (
                  <div className="border-2 border-primary rounded-md p-2 mt-1 text-muted-foreground">
                    No departments available
                  </div>
                ) : (
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="border-2 border-primary rounded-md p-2 mt-1">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Class and Date Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Class <span className="text-orange-600">*</span>
                  </label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                    disabled={classesLoading || !selectedDepartment}
                  >
                    <SelectTrigger className="border-2 border-primary rounded-md p-2 mt-1">
                      <SelectValue
                        placeholder={
                          selectedDepartment
                            ? "Select a class"
                            : "Select a department first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClasses.map((cls) => (
                        <SelectItem key={cls.id} value={String(cls.id)}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Date <span className="text-orange-600">*</span>
                  </label>
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border-2 border-primary rounded-md p-2 mt-1"
                    required
                  />
                </div>
              </div>

              {/* Students List */}
              {selectedDepartment && (
                <div>
                  <label className="text-sm font-medium">
                    Students ({markedStudents.length}/{students.length} marked)
                  </label>
                  {isLoadingStudents ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <Loader2 className="animate-spin mr-2" />
                      Loading students...
                    </div>
                  ) : students.length === 0 ? (
                    <div className="border-2 border-primary rounded-md p-4 mt-1 text-center text-muted-foreground">
                      No students found in this department
                    </div>
                  ) : (
                    <div className="border-2 border-primary rounded-md p-4 mt-1 max-h-[500px] overflow-y-auto space-y-3">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.rollNumber || "No roll number"}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                student.status === "present"
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                handleStatusChange(student.id, "present")
                              }
                              className={
                                student.status === "present"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : ""
                              }
                            >
                              Present
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                student.status === "absent"
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                handleStatusChange(student.id, "absent")
                              }
                              className={
                                student.status === "absent"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : ""
                              }
                            >
                              Absent
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                student.status === "late"
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                handleStatusChange(student.id, "late")
                              }
                              className={
                                student.status === "late"
                                  ? "bg-yellow-600 hover:bg-yellow-700"
                                  : ""
                              }
                            >
                              Late
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Separator />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSaving || !selectedClass || markedStudents.length === 0}
              >
                {isSaving ? (
                  <div className="flex gap-1">
                    <span>Saving Attendance...</span>
                    <Loader2 className="inline-block ml-2 animate-spin" />
                  </div>
                ) : (
                  `Save Attendance (${markedStudents.length} students)`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      </CreateView>
      </GuestActionGuard>
      );
      };

export default AttendanceCreate;
