import React, { useEffect, useState } from "react";
import { useList } from "@refinedev/core";
import { ClassDetails, Subject, User } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary";
import { BACKEND_BASE_URL } from "@/constants";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalClasses: 0,
        activeClasses: 0,
        totalSubjects: 0,
        totalTeachers: 0,
    });

    // Fetch classes
    const { query: classesQuery } = useList<ClassDetails>({
        resource: "classes",
        pagination: { pageSize: 6 },
        sorters: [{ field: "id", order: "desc" }],
    });

    // Fetch subjects
    const { query: subjectsQuery } = useList<Subject>({
        resource: "subjects",
        pagination: { pageSize: 100 },
    });

    // Fetch teachers
    const { query: teachersQuery } = useList<User>({
        resource: "users",
        filters: [{ field: "role", operator: "eq", value: "teacher" }],
        pagination: { pageSize: 100 },
    });

    const classes = classesQuery?.data?.data || [];
    const subjects = subjectsQuery?.data?.data || [];
    const teachers = teachersQuery?.data?.data || [];

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const baseUrl = BACKEND_BASE_URL.endsWith("/")
                    ? BACKEND_BASE_URL.slice(0, -1)
                    : BACKEND_BASE_URL;

                const [classesRes, subjectsRes, teachersRes] = await Promise.all([
                    fetch(`${baseUrl}/classes`),
                    fetch(`${baseUrl}/subjects`),
                    fetch(`${baseUrl}/users?role=teacher`),
                ]);

                if (classesRes.ok && subjectsRes.ok && teachersRes.ok) {
                    const classesData = await classesRes.json();
                    const subjectsData = await subjectsRes.json();
                    const teachersData = await teachersRes.json();

                    const allClasses = classesData.data || [];
                    const activeCount = allClasses.filter(
                        (c: ClassDetails) => c.status === "active",
                    ).length;

                    setStats({
                        totalClasses: allClasses.length,
                        activeClasses: activeCount,
                        totalSubjects: (subjectsData.data || []).length,
                        totalTeachers: (teachersData.data || []).length,
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-container space-y-6">
            {/* Welcome Header */}
            <div className="welcome-section">
                <h1 className="text-3xl font-bold">Welcome to School Management</h1>
                <p className="text-muted-foreground text-lg">
                    Manage your classes, subjects, and educational resources
                </p>
            </div>

            <Separator />

            {/* Statistics Cards */}
            <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Classes Card */}
                <Card className="stat-card p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Classes
                            </p>
                            <p className="text-3xl font-bold mt-2">{stats.totalClasses}</p>
                        </div>
                        <GraduationCap className="w-10 h-10 text-primary" />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 w-full justify-start p-0"
                    >
                        <Link to="/classes" className="text-sm hover:underline">
                            View all classes →
                        </Link>
                    </Button>
                </Card>

                {/* Active Classes Card */}
                <Card className="stat-card p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Active Classes
                            </p>
                            <p className="text-3xl font-bold mt-2">{stats.activeClasses}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        {Math.round((stats.activeClasses / stats.totalClasses) * 100)}%
                        active
                    </p>
                </Card>

                {/* Total Subjects Card */}
                <Card className="stat-card p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Subjects
                            </p>
                            <p className="text-3xl font-bold mt-2">{stats.totalSubjects}</p>
                        </div>
                        <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 w-full justify-start p-0"
                    >
                        <Link to="/subjects" className="text-sm hover:underline">
                            View all subjects →
                        </Link>
                    </Button>
                </Card>

                {/* Total Teachers Card */}
                <Card className="stat-card p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Teachers
                            </p>
                            <p className="text-3xl font-bold mt-2">{stats.totalTeachers}</p>
                        </div>
                        <Users className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        {stats.totalTeachers > 0
                            ? Math.round(stats.totalClasses / stats.totalTeachers)
                            : 0}{" "}
                        classes per teacher
                    </p>
                </Card>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Create New Class Tile */}
                    <Link to="/classes/create">
                      <Card className="p-6 h-40 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary group">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                              Create Class
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Set up new class
                            </p>
                          </div>
                          <Badge>New</Badge>
                        </div>
                        <GraduationCap className="w-8 h-8 text-primary" />
                      </Card>
                    </Link>

                    {/* Add Subject Tile */}
                    <Link to="/subjects/create">
                      <Card className="p-6 h-40 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary group">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                              Add Subject
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Create subject
                            </p>
                          </div>
                          <Badge>Manage</Badge>
                        </div>
                        <BookOpen className="w-8 h-8 text-primary" />
                      </Card>
                    </Link>

                    {/* Browse Classes Tile */}
                    <Link to="/classes">
                      <Card className="p-6 h-40 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary group">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                              Browse Classes
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              View all classes
                            </p>
                          </div>
                          <Badge>View</Badge>
                        </div>
                        <Users className="w-8 h-8 text-primary" />
                      </Card>
                    </Link>
                </div>
            </div>

            <Separator />

            {/* Recent Classes */}
            <div className="recent-classes-section">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Recent Classes</h2>
                    <Link to="/classes" className="text-sm text-primary hover:underline">
                        View all →
                    </Link>
                </div>

                {classesQuery.isLoading ? (
                    <p className="text-muted-foreground">Loading classes...</p>
                ) : classes.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">
                            No classes yet. Create your first class to get started.
                        </p>
                        <Button asChild className="mt-4">
                            <Link to="/classes/create">Create Class</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map((classItem) => (
                            <Link key={classItem.id} to={`/classes/show/${classItem.id}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    {/* Class Banner */}
                                    <div className="relative w-full h-32 bg-muted overflow-hidden">
                                        {classItem.bannerUrl ? (
                                            <AdvancedImage
                                                alt={classItem.name}
                                                cldImg={bannerPhoto(
                                                    classItem.bannerCldPubId ?? "",
                                                    classItem.name,
                                                )}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                                <GraduationCap className="w-8 h-8 text-white opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-bold text-base line-clamp-1">
                                                    {classItem.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {classItem.description}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    classItem.status === "active"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {classItem.status.charAt(0).toUpperCase() +
                                                    classItem.status.slice(1)}
                                            </Badge>
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Subject</span>
                                                <span className="font-medium">
                                                    {classItem.subject?.name || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Teacher</span>
                                                <span className="font-medium">
                                                    {classItem.teacher?.name || "Unknown"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Capacity</span>
                                                <span className="font-medium">
                                                    {classItem.capacity} spots
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
