import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { Attendance, ClassDetails } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useList } from "@refinedev/core";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { BACKEND_BASE_URL } from "@/constants";

const AttendanceList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch all departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const baseUrl = BACKEND_BASE_URL.endsWith("/")
          ? BACKEND_BASE_URL.slice(0, -1)
          : BACKEND_BASE_URL;
        const url = `${baseUrl}/departments?limit=500`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        const result = await response.json();
        setDepartments(result.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch classes based on selected department
  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedDepartment === "all") {
        setClasses([]);
        setSelectedClass("all");
        return;
      }

      try {
        setLoadingClasses(true);
        const baseUrl = BACKEND_BASE_URL.endsWith("/")
          ? BACKEND_BASE_URL.slice(0, -1)
          : BACKEND_BASE_URL;
        const url = `${baseUrl}/classes?limit=500`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const result = await response.json();
        const filteredClasses = (result.data || []).filter(
          (cls: ClassDetails) =>
            cls.department?.id === Number(selectedDepartment)
        );
        setClasses(filteredClasses);
        setSelectedClass("all");
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [selectedDepartment]);

  const departmentFilters =
    selectedDepartment === "all"
      ? []
      : [
          {
            field: "class.department.id",
            operator: "eq" as const,
            value: Number(selectedDepartment),
          },
        ];

  const classFilters =
    selectedClass === "all"
      ? []
      : [
          {
            field: "classId",
            operator: "eq" as const,
            value: Number(selectedClass),
          },
        ];

  const statusFilters =
    selectedStatus === "all"
      ? []
      : [{ field: "status", operator: "eq" as const, value: selectedStatus }];

  const dateFilters = selectedDate
    ? [{ field: "date", operator: "eq" as const, value: selectedDate }]
    : [];

  const searchFilters = searchQuery
    ? [{ field: "student.name", operator: "contains" as const, value: searchQuery }]
    : [];

  const rollNumberFilters = searchRollNumber
    ? [{ field: "student.rollNumber", operator: "contains" as const, value: searchRollNumber }]
    : [];

  useEffect(() => {
    console.log("Department Filters:", departmentFilters);
    console.log("Class Filters:", classFilters);
    console.log("Status Filters:", statusFilters);
    console.log("Date Filters:", dateFilters);
    console.log("Search Filters:", searchFilters);
    console.log("Roll Number Filters:", rollNumberFilters);
  }, [selectedDepartment, selectedClass, selectedStatus, selectedDate, searchQuery, searchRollNumber]);

  const attendanceColumns = useMemo<ColumnDef<Attendance>[]>(
    () => [
      {
        id: "date",
        accessorKey: "date",
        size: 120,
        header: () => <p className="column-title">Date</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">
            {new Date(getValue<string>()).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "class",
        accessorKey: "class.name",
        size: 150,
        header: () => <p className="column-title">Class</p>,
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {row.original.class?.name || "N/A"}
          </span>
        ),
      },
      {
        id: "studentName",
        accessorKey: "student.name",
        size: 200,
        header: () => <p className="column-title">Student Name</p>,
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {row.original.student?.name || "N/A"}
          </span>
        ),
      },
      {
        id: "rollNumber",
        accessorKey: "student.rollNumber",
        size: 120,
        header: () => <p className="column-title">Roll Number</p>,
        cell: ({ row }) => (
          <span className="text-foreground text-sm">
            {row.original.student?.rollNumber || "-"}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const variantMap: Record<string, "default" | "secondary" | "destructive"> = {
            present: "default",
            late: "secondary",
            absent: "destructive",
          };
          return (
            <Badge variant={variantMap[status] || "default"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        id: "delete",
        size: 100,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <DeleteButton
            resource="attendance"
            recordItemId={row.original.id}
            variant="destructive"
            size="sm"
          />
        ),
      },
    ],
    []
  );

  const attendanceTable = useTable<Attendance>({
    columns: attendanceColumns,
    refineCoreProps: {
      resource: "attendance",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [
          ...departmentFilters,
          ...classFilters,
          ...statusFilters,
          ...dateFilters,
          ...searchFilters,
          ...rollNumberFilters,
        ],
      },
      sorters: {
        initial: [{ field: "date", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Attendance</h1>

      <div className="intro-row">
        <p>View and manage student attendance records.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by student name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by roll number..."
              className="pl-10 w-full"
              value={searchRollNumber}
              onChange={(e) => setSearchRollNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-[180px] !border-primary">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {!loadingDepartments &&
                  departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px] !border-primary">
                <SelectValue
                  placeholder={
                    selectedDepartment === "all"
                      ? "Select department first"
                      : "Filter by class"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {!loadingClasses &&
                  classes.map((cls) => (
                    <SelectItem key={cls.id} value={String(cls.id)}>
                      {cls.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px] !border-primary">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-[180px] border-primary"
            />

            <CreateButton resource="attendance" />
          </div>
        </div>
      </div>

      <DataTable table={attendanceTable} />
    </ListView>
  );
};

export default AttendanceList;
