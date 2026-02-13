import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useShow, useNavigation } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from "@/constants";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";

interface Student {
    id: number;
    name: string;
    rollNumber?: string;
    image?: string;
}

interface AttendanceReport {
    summary: {
        total: number;
        present: number;
        absent: number;
        late: number;
        percentage: number;
    };
    byClass: Array<{
        classId: number;
        className: string;
        present: number;
        absent: number;
        late: number;
        total: number;
        percentage: number;
    }>;
}

interface ClassAttendance {
    classId: number;
    className: string;
    present: number;
    absent: number;
    late: number;
    total: number;
    percentage: number;
}

const AttendanceShow = () => {
    const { id } = useParams<{ id: string }>();
    
    const { query } = useShow<Student>({
        resource: "students",
        id: id,
    });
    const { show } = useNavigation();
    const [attendanceReport, setAttendanceReport] = useState<AttendanceReport | null>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    const student = query.data?.data;
    const { isLoading, isError } = query;

    console.log("AttendanceShow - ID from URL:", id);
    console.log("AttendanceShow - Student data:", student);

    // Fetch attendance report
    useEffect(() => {
        if (!student?.id) return;

        const fetchAttendanceReport = async () => {
            setIsLoadingReport(true);
            try {
                const baseUrl = BACKEND_BASE_URL.endsWith("/")
                    ? BACKEND_BASE_URL.slice(0, -1)
                    : BACKEND_BASE_URL;
                const response = await fetch(`${baseUrl}/attendance/student/${student.id}`);
                if (!response.ok) throw new Error("Failed to fetch attendance report");
                const data = await response.json();
                setAttendanceReport(data.data);
            } catch (error) {
                console.error("Error fetching attendance report:", error);
                setAttendanceReport(null);
            } finally {
                setIsLoadingReport(false);
            }
        };

        fetchAttendanceReport();
    }, [student?.id]);



    if (isLoading || isError || !student) {
        return (
            <ShowView className="attendance-view attendance-show">
                <ShowViewHeader resource="attendance" title="Student Attendance" />

                <p className="state-message">
                    {isLoading
                        ? "Loading Student Details..."
                        : isError
                        ? "Error loading student details"
                        : "Student not found"}
                </p>
            </ShowView>
        );
    }

    const { name, rollNumber, image } = student;
    const studentInitials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toLocaleUpperCase())
        .join("");
    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
        studentInitials || "NA",
    )}`;

    return (
        <ShowView className="attendance-view attendance-show">
            <ShowViewHeader resource="attendance" title="Student Attendance Report" />

            <Card className="details-card">
                <div className="details-header">
                    <div className="flex items-center gap-4">
                        <img
                            src={image ?? placeholderUrl}
                            alt={name}
                            className="rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                            <h1>{name}</h1>
                            <p className="text-muted-foreground">
                                {rollNumber ? `Roll No: ${rollNumber}` : "No roll number"}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                {isLoadingReport ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin mr-2" />
                        <span>Loading attendance report...</span>
                    </div>
                ) : !attendanceReport ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No attendance data available
                    </div>
                ) : (
                    <>
                        <div className="details-grid grid-cols-4">
                             <div className="department">
                                 <p>Total Days</p>
                                 <div>
                                     <p className="text-3xl">
                                         {attendanceReport.summary.total}
                                     </p>
                                 </div>
                             </div>

                             <div className="department">
                                 <p>Present Days</p>
                                 <div>
                                     <p className="text-3xl">
                                         {attendanceReport.summary.present}
                                     </p>
                                 </div>
                             </div>

                             <div className="subject">
                                 <p>Absent Days</p>
                                 <div>
                                     <p className="text-3xl">
                                         {attendanceReport.summary.absent}
                                     </p>
                                 </div>
                             </div>

                             <div className="subject">
                                 <p>Attendance %</p>
                                 <div>
                                     <p className="text-3xl">
                                         {attendanceReport.summary.percentage}%
                                     </p>
                                 </div>
                             </div>
                         </div>

                        <Separator />

                        {attendanceReport.byClass && attendanceReport.byClass.length > 0 && (
                            <>
                                <div className="subject">
                                    <p>Attendance by Class</p>
                                    <div className="mt-4">
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted">
                                                        <tr className="border-b">
                                                            <th className="px-4 py-3 text-left font-semibold">
                                                                Class Name
                                                            </th>
                                                            <th className="px-4 py-3 text-left font-semibold text-green-600">
                                                                Present
                                                            </th>
                                                            <th className="px-4 py-3 text-left font-semibold text-red-600">
                                                                Absent
                                                            </th>
                                                            <th className="px-4 py-3 text-left font-semibold text-yellow-600">
                                                                Late
                                                            </th>
                                                            <th className="px-4 py-3 text-left font-semibold">
                                                                Total
                                                            </th>
                                                            <th className="px-4 py-3 text-left font-semibold">
                                                                Percentage
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {attendanceReport.byClass.map((classAttendance) => (
                                                            <tr
                                                                key={classAttendance.classId}
                                                                className="border-b hover:bg-muted/50"
                                                            >
                                                                <td className="px-4 py-3 font-medium">
                                                                    {classAttendance.className}
                                                                </td>
                                                                <td className="px-4 py-3 text-green-600 font-semibold">
                                                                    {classAttendance.present}
                                                                </td>
                                                                <td className="px-4 py-3 text-red-600 font-semibold">
                                                                    {classAttendance.absent}
                                                                </td>
                                                                <td className="px-4 py-3 text-yellow-600 font-semibold">
                                                                    {classAttendance.late}
                                                                </td>
                                                                <td className="px-4 py-3 font-medium">
                                                                    {classAttendance.total}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <Badge
                                                                        variant={
                                                                            classAttendance.percentage >= 85
                                                                                ? "default"
                                                                                : classAttendance.percentage >= 75
                                                                                ? "secondary"
                                                                                : "destructive"
                                                                        }
                                                                    >
                                                                        {classAttendance.percentage}%
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </Card>
        </ShowView>
    );
};

export default AttendanceShow;
