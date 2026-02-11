import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Department } from "@/types";
import { useShow, useNavigation } from "@refinedev/core";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import React from "react";

const TeacherShow = () => {
  const { query } = useShow<User>({
    resource: "teachers",
  });
  const { show } = useNavigation();

  const teacher = query.data?.data;
  const { isLoading, isError } = query;

  // Use the departments array already loaded on the teacher object
  const teacherDepartments = teacher?.departments || [];

  // Setup departments table columns
  const departmentColumns = useMemo<ColumnDef<Department>[]>(
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
  );

  // Create a local table using useReactTable
  const departmentsTable = useReactTable({
    data: teacherDepartments,
    columns: departmentColumns,
    getCoreRowModel: getCoreRowModel(),
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
          {teacherDepartments && teacherDepartments.length > 0 ? (
            <Table>
              <TableHeader>
                {departmentsTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {departmentsTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No departments allocated</p>
            </div>
          )}
        </div>

        <Separator />

        {classes && classes.length > 0 && (
          <>
            <div className="subject">
              <p>Allocated Classes</p>

              <div>
                {classes.map((cls) => (
                  <div key={cls.id} className="mb-3">
                    <p className="font-semibold">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cls.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>
    </ShowView>
  );
};

export default TeacherShow;
