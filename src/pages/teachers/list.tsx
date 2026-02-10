import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BACKEND_BASE_URL } from '@/constants'
import { Department, User } from '@/types'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Search, Eye } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useGo } from '@refinedev/core'

const TeacherList = () => {
  const go = useGo()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true)
        // Ensure proper URL construction - handle trailing slash
        const baseUrl = BACKEND_BASE_URL.endsWith('/') 
          ? BACKEND_BASE_URL.slice(0, -1) 
          : BACKEND_BASE_URL
        const url = `${baseUrl}/departments`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch departments')
        }
        const result = await response.json()
        setDepartments(result.data || [])
      } catch (error) {
        console.error('Error fetching departments:', error)
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

  const departmentFilters = selectedDepartment === "all" ? [] : [
    {
      field: 'department',
      operator: 'eq'as const,
      value: selectedDepartment
    }
  ]

  const searchFilters = searchQuery ? [
    {
      field: 'name',
      operator: 'contains' as const,
      value: searchQuery
    }
  ] : [];

  const teacherTable = useTable<User>({
    columns: useMemo<ColumnDef<User>[]>(() => [
      {
        id: 'image',
        accessorKey: 'image',
        size: 80,
        header: () => <p className='column-title ml-2'>Photo</p>,
        cell: ({ getValue }) => (
          <div className='flex items-center justify-center ml-2'>
            <img
              src={getValue<string>() || '/placeholder-user.png'}
              alt='Teacher Photo'
              className='w-10 h-10 rounded-full object-cover'
            />
          </div>
        )
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell: ({ getValue}) => <span className='text-foreground'>{getValue<string>()}</span>,
        filterFn: 'includesString'
      },
      {
        id: 'email',
        accessorKey: 'email',
        size: 250,
        header: () => <p className='column-title'>Email</p>,
        cell: ({ getValue}) => <span className='text-foreground text-sm'>{getValue<string>()}</span>,
      },
      {
        id: 'phoneNumber',
        accessorKey: 'phoneNumber',
        size: 150,
        header: () => <p className='column-title'>Phone Number</p>,
        cell: ({ getValue}) => <span className='text-foreground text-sm'>{getValue<string>() || 'N/A'}</span>,
      },
      {
        id: 'actions',
        accessorKey: 'id',
        size: 100,
        header: () => <p className='column-title'>Details</p>,
        cell: ({ getValue}) => (
          <Button 
            variant='ghost' 
            size='sm'
            onClick={() => go({ to: { resource: 'teachers', action: 'show', id: getValue<string>() } })}
          >
            View
          </Button>
        ),
      },
      {
        id: 'delete',
        size: 100,
        header: () => <p className='column-title'>Delete</p>,
        cell: ({ row }) => <DeleteButton resource='users' recordItemId={row.original.id} variant='destructive' size='sm' />
      }
    ], []),
    refineCoreProps: {
      resource: 'users',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: [
          {
            field: 'role',
            operator: 'eq' as const,
            value: 'teacher'
          },
          ...departmentFilters, 
          ...searchFilters
        ],
      },
      sorters: {
        initial: [
          {
            field: 'id',
            order: 'desc'
          }
        ]
      },

    }
  })
  return (
    <ListView>
      <Breadcrumb />

      <h1 className='page-title'>Teachers</h1>

      <div className='intro-row'>
        <p>Quick access to esesntial metrics and management tools.</p>

        <div className='action-row'>
          <div className='search-field'>
            <Search className='search-icon'/>

            <Input 
              type='text'
              placeholder='Search by name'
              className='pl-10 w-full'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='flex gap-2 pt-2 w-full sm:w-auto'>
            <Select 
              value={selectedDepartment}
              onValueChange={(value) => setSelectedDepartment(value)}
            >
              <SelectTrigger className='!border-primary'>
                <SelectValue placeholder="Filter by department"/>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {!loadingDepartments && departments.map(department => (
                  <SelectItem 
                    key={department.id} 
                    value={department.name}
                  >
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={teacherTable}/>
    </ListView>
  )
}

export default TeacherList
