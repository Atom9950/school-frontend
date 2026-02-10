import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useShow, useInvalidate } from "@refinedev/core";
import React, { useState, useEffect } from "react";

interface Student {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    fathersName?: string;
    mothersName?: string;
    address?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    admissionDate: string;
    department?: {
        id: number;
        name: string;
    };
    rollNumber?: string;
    image?: string;
}

interface Department {
    id: number;
    code: string;
    name: string;
    description?: string;
    level: number;
}

const StudentShow = () => {
    const { query } = useShow<Student>({
        resource: "students",
    });
    const invalidate = useInvalidate();

    const student = query.data?.data;
    const { isLoading, isError } = query;

    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [isPromoting, setIsPromoting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    // Fetch available higher-level departments for promotion
    useEffect(() => {
        if (!student) return;

        const fetchAvailablePromotions = async () => {
            setLoadingDepartments(true);
            try {
                const backendUrl =
                    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
                const baseUrl = backendUrl.endsWith("/")
                    ? backendUrl.slice(0, -1)
                    : backendUrl;
                const url = `${baseUrl}/students/${student.id}/available-promotions`;
                console.log("Fetching available promotions from:", url);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch available promotions: ${response.statusText}`,
                    );
                }
                const result = await response.json();
                console.log("Available promotions fetched:", result);
                setDepartments(result.data || []);
            } catch (error) {
                console.error("Failed to fetch available promotions:", error);
                setDepartments([]);
            } finally {
                setLoadingDepartments(false);
            }
        };

        // Only fetch when dialog is opened
        if (dialogOpen) {
            fetchAvailablePromotions();
        }
    }, [student, dialogOpen]);

    // Handle student promotion
    const handlePromoteStudent = async () => {
        if (!selectedDepartment || !student) return;

        setIsPromoting(true);
        try {
            const backendUrl =
                import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
            const baseUrl = backendUrl.endsWith("/")
                ? backendUrl.slice(0, -1)
                : backendUrl;
            const url = `${baseUrl}/students/${student.id}/promote`;
            console.log("Promoting student to:", url);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ departmentId: Number(selectedDepartment) }),
            });

            if (!response.ok) {
                throw new Error(`Failed to promote student: ${response.statusText}`);
            }

            // Invalidate the student query to refetch updated data
            invalidate({
                resource: "students",
                invalidates: ["list", "detail"],
                id: student.id,
            });
            setDialogOpen(false);
            setSelectedDepartment("");
        } catch (error) {
            console.error("Failed to promote student:", error);
            alert("Failed to promote student");
        } finally {
            setIsPromoting(false);
        }
    };

    if (isLoading || isError || !student) {
        return (
            <ShowView className="student-view student-show">
                <ShowViewHeader resource="students" title="Student Details" />

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

    const {
        name,
        email,
        age,
        gender,
        fathersName,
        mothersName,
        address,
        phoneNumber,
        whatsappNumber,
        admissionDate,
        department,
        rollNumber,
        image,
    } = student;
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
        <ShowView className="student-view student-show">
            <ShowViewHeader resource="students" title="Student Details" />

            <Card className="details-card">
                <div className="details-header">
                    <div className="flex items-center gap-4">
                        <img
                            src={image ?? placeholderUrl}
                            alt={name}
                            className="size-23 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                            <h1>{name}</h1>
                            <p>{email}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center">
                        <Badge variant="default">STUDENT</Badge>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Promote
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Promote Student</DialogTitle>
                                    <DialogDescription>
                                        {loadingDepartments
                                            ? "Loading available departments..."
                                            : departments.length === 0
                                                ? "No higher-level departments available for promotion"
                                                : `Select a department to promote ${name} to`}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    {departments.length > 0 && (
                                        <Select
                                            value={selectedDepartment}
                                            onValueChange={setSelectedDepartment}
                                            disabled={loadingDepartments}
                                        >
                                            <SelectTrigger className="border-primary" disabled={loadingDepartments}>
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
                                    {departments.length === 0 && !loadingDepartments && (
                                        <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                                            This student has already been promoted to the highest
                                            available level.
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handlePromoteStudent}
                                            disabled={
                                                !selectedDepartment ||
                                                isPromoting ||
                                                loadingDepartments ||
                                                departments.length === 0
                                            }
                                        >
                                            {isPromoting ? "Promoting..." : "Promote"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="details-grid grid-cols-3">
                    <div className="instructor">
                        <p>Contact Information</p>
                        <div>
                            <div>
                                <p className="text-lg">{email}</p>
                                <p className="text-lg font-bold text-muted-foreground">
                                    {phoneNumber ? phoneNumber : "No phone number provided"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="department">
                        <p>Personal Information</p>

                        <div>
                            <p className="text-lg">
                                {gender
                                    ? `${gender}`.slice(0, 1).toUpperCase() + `${gender}`.slice(1)
                                    : "N/A"}
                            </p>
                            <p className="text-lg font-bold">
                                {age ? `Age: ${age}` : "Age not provided"}
                            </p>
                        </div>
                    </div>

                    <div className="subject">
                        <p>Admission Date</p>

                        <div>
                            <p className="text-lg">
                                {admissionDate
                                    ? new Date(admissionDate).toLocaleDateString()
                                    : "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                {(rollNumber || department) && (
                    <>
                        <div className="grid grid-cols-2 gap-6">
                            {rollNumber && (
                                <div className="subject">
                                    <p>Roll Number</p>
                                    <div>
                                        <p>{rollNumber}</p>
                                    </div>
                                </div>
                            )}

                            {department && (
                                <div className="subject">
                                    <p>Department</p>
                                    <div>
                                        <p className="font-semibold">{department.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />
                    </>
                )}

                {whatsappNumber && (
                    <>
                        <div className="subject">
                            <p>WhatsApp Number</p>

                            <div>
                                <p>{whatsappNumber}</p>
                            </div>
                        </div>

                        <Separator />
                    </>
                )}

                {(fathersName || mothersName) && (
                    <>
                        <div className="grid grid-cols-2 gap-6">
                            {fathersName && (
                                <div className="subject">
                                    <p>Father's Name</p>
                                    <div>
                                        <p>{fathersName}</p>
                                    </div>
                                </div>
                            )}

                            {mothersName && (
                                <div className="subject">
                                    <p>Mother's Name</p>
                                    <div>
                                        <p>{mothersName}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />
                    </>
                )}

                {address && (
                    <>
                        <div className="subject">
                            <p>Address</p>

                            <div>
                                <p>{address}</p>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </ShowView>
    );
};

export default StudentShow;
