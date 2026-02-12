import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { User, Department, ClassDetails } from "@/types";
import { useShow, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import React from "react";

const TeacherShow = () => {
  const { query } = useShow<User>({
    resource: "teachers",
  });
  const { show } = useNavigation();

  const teacher = query.data?.data;
  const { isLoading, isError } = query;

  // Get teacher ID for filtering departments and classes
  const teacherId = teacher?.id ? String(teacher.id) : undefined;
  console.log("Teacher ID:", teacherId);
  console.log("Teacher data:", teacher);

  const departmentFilters = teacherId
    ? [
        {
          field: "id",
          operator: "eq" as const,
          value: teacherId,
        },
      ]
    : [];

  const classFilters = teacherId
    ? [
        {
          field: "id",
          operator: "eq" as const,
          value: teacherId,
        },
      ]
    : [];

  // Setup departments table with filters based on teacher's departments
  const departmentsTable = useTable<Department>({
    columns: useMemo<ColumnDef<Department>[]>(
      () => [
        {
          id: "bannerUrl",
          accessorKey: "bannerUrl",
          size: 100,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => {
            const imageUrl = getValue<string>();
            return (
              <div className="flex items-center justify-start ml-2 py-2">
                <img
                  src={imageUrl || "/placeholder-class.png"}
                  alt="Department Banner"
                  className="h-12 w-12 rounded object-cover"
                />
              </div>
            );
          },
        },
        {
          id: "name",
          accessorKey: "name",
          size: 250,
          header: () => <p className="column-title">Department Name</p>,
          cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">
                {getValue<string>()}
              </span>
            </div>
          ),
        },
        {
          id: "description",
          accessorKey: "description",
          size: 350,
          header: () => <p className="column-title">Description</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground text-sm">
              {getValue<string>() || "-"}
            </span>
          ),
        },
        {
          id: "details",
          size: 140,
          header: () => <p className="column-title">Details</p>,
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => show("departments", String(row.original.id))}
            >
              View
            </Button>
          ),
        },
      ],
      [show],
    ),
    refineCoreProps: {
      resource: "departments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: departmentFilters,
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  // Setup classes table with filters based on teacher's classes
  const classesTable = useTable<ClassDetails>({
    columns: useMemo<ColumnDef<ClassDetails>[]>(
      () => [
        {
          id: "bannerUrl",
          accessorKey: "bannerUrl",
          size: 80,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => (
            <div className="flex items-center justify-start ml-2 py-2">
              <img
                src={getValue<string>() || "/placeholder-class.png"}
                alt="Class Banner"
                className="w-10 h-10 rounded object-cover"
              />
            </div>
          ),
        },
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title">Class Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground font-medium">
              {getValue<string>()}
            </span>
          ),
        },
        {
          id: "status",
          accessorKey: "status",
          size: 100,
          header: () => <p className="column-title">Status</p>,
          cell: ({ getValue }) => {
            const status = getValue<string>();
            return (
              <Badge variant={status === "active" ? "default" : "secondary"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            );
          },
        },
        {
          id: "subject",
          accessorKey: "subject.name",
          size: 150,
          header: () => <p className="column-title">Subject</p>,
          cell: ({ row }) => (
            <span className="text-foreground">
              {row.original.subject?.name || "-"}
            </span>
          ),
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 100,
          header: () => <p className="column-title">Capacity</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<number>()}</span>
          ),
        },
        {
          id: "details",
          size: 140,
          header: () => <p className="column-title">Details</p>,
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => show("classes", String(row.original.id))}
            >
              View
            </Button>
          ),
        },
      ],
      [show],
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: classFilters,
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  if (isLoading || isError || !teacher) {
    return (
      <ShowView className="teacher-view teacher-show">
        <ShowViewHeader resource="teachers" title="Teacher Details" />

        <p className="state-message">
          {isLoading
            ? "Loading Teacher Details..."
            : isError
            ? "Error loading teacher details"
            : "Teacher not found"}
        </p>
      </ShowView>
    );
  }

  const {
    name,
    email,
    role,
    department,
    image,
    address,
    age,
    gender,
    joiningDate,
    bio,
    phoneNumber,
    classes,
    departments,
  } = teacher;
  const teacherInitials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase())
    .join("");
  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA",
  )}`;

  return (
    <ShowView className="teacher-view teacher-show">
      <ShowViewHeader resource="teachers" title="Teacher Details" />

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

          <div>
            <Badge variant={role === "teacher" ? "default" : "secondary"}>
              {role?.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="details-grid grid-cols-3">
          <div className="instructor">
            <p>Contact Information</p>
            <div>
              <div>
                <p className="text-lg">{email}</p>
                <p className="text-lg font-bold text-muted-foreground">
                  {phoneNumber ? phoneNumber : "No mobile number provided"}
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
            <p>Joining Date</p>

            <div>
              <p className="text-lg">
                {joiningDate
                  ? new Date(joiningDate).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="subject">
          <p>Bio</p>

          <div>
            <p>{bio || "No bio provided"}</p>
          </div>
        </div>

        <Separator />

        <div className="subject">
          <p>Address</p>

          <div>
            <p>{address || "No address provided"}</p>
          </div>
        </div>

        <Separator />

        <div className="departments">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">
            Associated Departments
          </p>
          <DataTable table={departmentsTable} />
        </div>

        <Separator />

        <div className="classes">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">
            Allocated Classes
          </p>
          <DataTable table={classesTable} />
        </div>
      </Card>
    </ShowView>
  );
};

export default TeacherShow;
