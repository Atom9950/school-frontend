import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BACKEND_BASE_URL } from '@/constants'
import { User } from '@/types'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Search, Eye } from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'
import { useGo, useList } from '@refinedev/core'

const StudentsList = () => {
  const go = useGo()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')

  const { query: departmentsQuery } = useList<any>({
    resource: 'departments',
    pagination: { pageSize: 100 }
  });

  const departments = departmentsQuery?.data?.data || [];
  const genders = ['male', 'female', 'others'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])



  const departmentFilters = selectedDepartment === 'all' ? [] : [
    { field: 'department', operator: 'eq' as const, value: selectedDepartment }
  ];
  const genderFilters = selectedGender === 'all' ? [] : [
    { field: 'gender', operator: 'eq' as const, value: selectedGender }
  ];
  const searchFilters = debouncedSearchQuery ? [
    {
      field: 'name',
      operator: 'contains' as const,
      value: debouncedSearchQuery
    }
  ] : [];
  
  const studentTable = useTable<any>({
    columns: useMemo<ColumnDef<any>[]>(() => [
      {
        id: 'image',
        accessorKey: 'image',
        size: 80,
        header: () => <p className='column-title ml-2'>Photo</p>,
        cell: ({ getValue }) => (
          <div className='flex items-center justify-center ml-2'>
            <img
              src={getValue<string>() || '/placeholder-user.png'}
              alt='Student Photo'
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
      // {
      //   id: 'email',
      //   accessorKey: 'email',
      //   size: 250,
      //   header: () => <p className='column-title'>Email</p>,
      //   cell: ({ getValue}) => <span className='text-foreground text-sm'>{getValue<string>()}</span>,
      // },
      {
        id: 'phoneNumber',
        accessorKey: 'phoneNumber',
        size: 150,
        header: () => <p className='column-title'>Phone Number</p>,
        cell: ({ getValue}) => <span className='text-foreground text-sm'>{getValue<string>() || 'N/A'}</span>,
      },
      {
        id: 'gender',
        accessorKey: 'gender',
        size: 120,
        header: () => <p className='column-title'>Gender</p>,
        cell: ({ getValue}) => <span className='text-foreground text-sm'>{getValue<string>() || 'N/A'}</span>,
      },
      {
        id: 'age',
        accessorKey: 'age',
        size: 80,
        header: () => <p className='column-title'>Age</p>,
        cell: ({ getValue}) => <span className='text-foreground text-sm'>{getValue<string>() || 'N/A'}</span>,
      },
      {
        id: 'department',
        accessorKey: 'department',
        size: 150,
        header: () => <p className='column-title'>Department</p>,
        cell: ({ getValue}) => {
          const value = getValue<any>()
          const deptName = typeof value === 'object' ? value?.name : value
          return <span className='text-foreground text-sm'>{deptName || 'N/A'}</span>
        },
      },
      {
        id: 'rollNumber',
        accessorKey: 'rollNumber',
        size: 120,
        header: () => <p className='column-title'>Roll Number</p>,
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
            onClick={() => go({ to: { resource: 'students', action: 'show', id: getValue<string>() } })}
          >
            View
          </Button>
        ),
      },
      {
        id: 'delete',
        size: 100,
        header: () => <p className='column-title'>Actions</p>,
        cell: ({ row }) => <DeleteButton resource='students' recordItemId={row.original.id} variant='destructive' size='sm' />
      }
    ], [go]),
    refineCoreProps: {
     resource: 'students',
     pagination: {
       pageSize: 10,
       mode: 'server',
     },
     filters: {
       permanent: [...departmentFilters, ...genderFilters, ...searchFilters],
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

      <h1 className='page-title'>Students</h1>

      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools.</p>

        <div className='actions-row'>
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

          <div className='flex flex-wrap gap-2 w-full sm:w-auto'>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className='w-[180px] !border-primary'>
                <SelectValue placeholder='Filter by department' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='all'>
                  All Departments
                </SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedGender}
              onValueChange={setSelectedGender}
            >
              <SelectTrigger className='w-[180px] !border-primary'>
                <SelectValue placeholder='Filter by gender' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='all'>
                  All Genders
                </SelectItem>
                {genders.map(gender => (
                  <SelectItem key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={studentTable}/>
    </ListView>
  )
}

export default StudentsList
