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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Department, ClassDetails } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const attendanceSchema = z.object({
    departmentId: z.string().min(1, "Department is required"),
    classId: z.string().min(1, "Class is required"),
    date: z.string().min(1, "Date is required"),
});

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

    const form = useForm({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            departmentId: "",
            classId: "",
            date: new Date().toISOString().split("T")[0],
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        control,
        watch,
    } = form;

    const [students, setStudents] = useState<StudentAttendance[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    // Fetch departments
    const { query: departmentsQuery } = useList<Department>({
        resource: "departments",
        pagination: { pageSize: 100 },
    });

    const departments = departmentsQuery?.data?.data || [];
    const departmentsLoading = departmentsQuery?.isLoading;

    // Fetch classes
    const { query: classesQuery } = useList<ClassDetails>({
        resource: "classes",
        pagination: { pageSize: 100 },
    });

    const allClasses = classesQuery?.data?.data || [];
    const classesLoading = classesQuery?.isLoading;

    const selectedDepartment = watch("departmentId");
    const selectedClass = watch("classId");

    // Filter classes by selected department
    const filteredClasses = selectedDepartment
        ? allClasses.filter(
            (cls) => cls.department?.id === Number(selectedDepartment),
        )
        : [];

    // Fetch students for selected department
    useEffect(() => {
        if (!selectedDepartment) {
            setStudents([]);
            return;
        }

        const fetchStudents = async () => {
            setIsLoadingStudents(true);
            try {
                const baseUrl = BACKEND_BASE_URL.endsWith("/")
                    ? BACKEND_BASE_URL.slice(0, -1)
                    : BACKEND_BASE_URL;
                const url = `${baseUrl}/students?departmentId=${selectedDepartment}&page=1&limit=500`;

                const response = await fetch(url);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch students");
                }

                const studentList = (data.data || []).map((student: any) => ({
                    id: student.id,
                    name: student.name,
                    rollNumber: student.rollNumber,
                    status: null as "present" | "absent" | "late" | null,
                }));
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
        status: "present" | "absent" | "late",
    ) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === studentId ? { ...student, status } : student,
            ),
        );
    };

    const markedStudents = students.filter((s) => s.status !== null);

    const onSubmit = async (values: z.infer<typeof attendanceSchema>) => {
        if (markedStudents.length === 0) {
            alert("Please mark attendance for at least one student");
            return;
        }

        const records = markedStudents.map((student) => ({
            classId: Number(values.classId),
            studentId: student.id,
            date: values.date,
            status: student.status,
        }));

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
                    list("attendance");
                },
            },
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
                    <Card className="attendance-form-card">
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                                Fill out Form
                            </CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent className="mt-7">
                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Department Selection */}
                                    <FormField
                                        control={control}
                                        name="departmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Department <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={departmentsLoading}
                                                >
                                                    <FormControl className="border-2 border-primary rounded-md p-2">
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departments.map((dept) => (
                                                            <SelectItem key={dept.id} value={String(dept.id)}>
                                                                {dept.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Class and Date Row */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={control}
                                            name="classId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Class <span className="text-orange-600">*</span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={classesLoading || !selectedDepartment}
                                                    >
                                                        <FormControl className="border-2 border-primary rounded-md p-2">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue
                                                                    placeholder={
                                                                        selectedDepartment
                                                                            ? "Select a class"
                                                                            : "Select a department first"
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {filteredClasses.map((cls) => (
                                                                <SelectItem key={cls.id} value={String(cls.id)}>
                                                                    {cls.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Date <span className="text-orange-600">*</span>
                                                    </FormLabel>
                                                    <FormControl className="border-2 border-primary rounded-md p-2">
                                                        <Input type="date" {...field} required />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Students List */}
                                    {selectedDepartment && (
                                        <div>
                                            <label className="text-sm font-medium">
                                                Students ({markedStudents.length}/{students.length}{" "}
                                                marked)
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
                                        disabled={
                                            isSubmitting ||
                                            !selectedClass ||
                                            markedStudents.length === 0
                                        }
                                    >
                                        {isSubmitting ? (
                                            <div className="flex gap-1">
                                                <span>Saving Attendance...</span>
                                                <Loader2 className="inline-block ml-2 animate-spin" />
                                            </div>
                                        ) : (
                                            `Save Attendance (${markedStudents.length} students)`
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </CreateView>
        </GuestActionGuard>
    );
};

export default AttendanceCreate;
