import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BACKEND_BASE_URL } from '@/constants'
import { Department, Subject } from '@/types'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

const SubjectList = () => {

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

  const subjectTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: 'code', 
        accessorKey: 'code', 
        size: 100, 
        header: () => <p className='column-title ml-2 '>Code</p>,
        cell: ({ getValue}) => <Badge>{getValue<string>()}</Badge>
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
        id: 'department',
        accessorKey: 'department.name',
        size: 150,
        header: () => <p className='column-title'>Department</p>,
        cell: ({ getValue}) => <Badge variant='secondary'>{getValue<string>()}</Badge>,
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title'>Description</p>,
        cell: ({ getValue}) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
      }
    ], []),
    refineCoreProps: {
      resource: 'subjects',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: [...departmentFilters, ...searchFilters],
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

      <h1 className='page-title'>Subjects</h1>

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

      <DataTable table={subjectTable}/>
    </ListView>
  )
}

export default SubjectList
