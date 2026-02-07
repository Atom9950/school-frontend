import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useMemo, useState } from "react";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table";
import { Department } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ShowButton } from "@/components/refine-ui/buttons/show.tsx";

const DepartmentsList = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const departmentColumns = useMemo<ColumnDef<Department>[]>(() => [
        {
            id: 'name',
            accessorKey: 'name',
            size: 250,
            header: () => <p className="column-title">Department Name</p>,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">{getValue<string>()}</span>
                </div>
            ),
        },
        {
            id: 'description',
            accessorKey: 'description',
            size: 350,
            header: () => <p className="column-title">Description</p>,
            cell: ({ getValue }) => <span className="text-foreground text-sm">{getValue<string>() || '-'}</span>,
        },
        {
            id: 'details',
            size: 140,
            header: () => <p className="column-title">Details</p>,
            cell: ({ row }) => <ShowButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
        }
    ], []);

    const departmentTable = useTable<Department>({
        columns: departmentColumns,
        refineCoreProps: {
            resource: 'departments',
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...searchFilters]
            },
            sorters: {
                initial: [
                    { field: 'id', order: 'desc' },
                ]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Departments</h1>

            <div className="intro-row">
                <p>Manage your academic departments and their information.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <CreateButton resource="departments" />
                </div>
            </div>

            <DataTable table={departmentTable} />
        </ListView>
    )
}

export default DepartmentsList;
