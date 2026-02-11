import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { DeleteButton } from '@/components/refine-ui/buttons/delete';
import { Badge } from '@/components/ui/badge';
import { Department, Subject, User, ClassDetails } from '@/types'
import { useShow, useList, useNavigation } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { AdvancedImage } from '@cloudinary/react';
import { Building2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bannerPhoto } from '@/lib/cloudinary';
import { useMemo } from 'react';

const DepartmentShow = () => {
  const { query } = useShow<Department>({resource: 'departments'});
  const { show } = useNavigation();
  
  const department = query.data?.data;
  const {isLoading, isError} = query
  
  // Fetch subjects filtered by department name
  const { query: subjectsQuery } = useList<Subject>({
    resource: 'subjects',
    filters: department?.name ? [{ field: 'department', operator: 'eq', value: department.name }] : [],
    pagination: { pageSize: 1000 },
  });

  const departmentSubjects = subjectsQuery?.data?.data || [];

  // Get teachers from department data (fetched from backend)
  const departmentTeachers = department?.teachers || [];

  // Setup subjects table with department filter
  const subjectDepartmentFilter = department?.id ? [
    { field: 'department', operator: 'eq' as const, value: String(department.id) }
  ] : [];

  const subjectsTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: 'code', 
        accessorKey: 'code', 
        size: 100, 
        header: () => <p className='column-title ml-2 '>Code</p>,
        cell: ({ getValue}) => {
          const Badge = ({ children }: { children: React.ReactNode }) => (
            <span className='inline-block px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded'>{children}</span>
          );
          return <Badge>{getValue<string>()}</Badge>;
        }
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
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title'>Description</p>,
        cell: ({ getValue}) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
      },
      {
        id: 'delete',
        size: 100,
        header: () => <p className='column-title'>Action</p>,
        cell: ({ row }) => <DeleteButton resource="subjects" recordItemId={String(row.original.id)} variant='destructive' size='sm' />
      }
    ], []),
    refineCoreProps: {
      resource: 'subjects',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: subjectDepartmentFilter,
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

  // Setup teachers table with department filter
  const departmentIdFilter = department?.id ? [
    { field: 'department', operator: 'eq' as const, value: String(department.id) }
  ] : [];

  const teachersTable = useTable<User>({
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
            onClick={() => show('teachers', getValue<string>())}
          >
            View
          </Button>
        ),
      },
      {
        id: 'delete',
        size: 100,
        header: () => <p className='column-title'>Actions</p>,
        cell: ({ row }) => <DeleteButton resource='users' recordItemId={row.original.id} variant='destructive' size='sm' />
      }
    ], [show]),
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
          ...departmentIdFilter
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

  // Setup students table with department filter
  const departmentFilters = department?.name ? [
    { field: 'department', operator: 'eq' as const, value: department.name }
  ] : [];

  const studentsTable = useTable<any>({
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
            onClick={() => show('students', getValue<string>())}
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
    ], [show]),
    refineCoreProps: {
      resource: 'students',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: departmentFilters,
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

  // Setup classes table with department filter
  const classesFilter = department?.id ? [
    { field: 'department', operator: 'eq' as const, value: String(department.id) }
  ] : [];

  const classesTable = useTable<ClassDetails>({
    columns: useMemo<ColumnDef<ClassDetails>[]>(() => [
      {
        id: 'bannerUrl',
        accessorKey: 'bannerUrl',
        size: 80,
        header: () => <p className='column-title ml-2'>Banner</p>,
        cell: ({ getValue }) => (
          <div className='flex items-center justify-center ml-2'>
            <img
              src={getValue<string>() || '/placeholder-class.png'}
              alt='Class Banner'
              className='w-10 h-10 rounded object-cover'
            />
          </div>
        )
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Class Name</p>,
        cell: ({ getValue }) => <span className='text-foreground font-medium'>{getValue<string>()}</span>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        size: 100,
        header: () => <p className='column-title'>Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        }
      },
      {
        id: 'subject',
        accessorKey: 'subject.name',
        size: 150,
        header: () => <p className='column-title'>Subject</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
      },
      {
        id: 'teacher',
        accessorKey: 'teacher.name',
        size: 150,
        header: () => <p className='column-title'>Teacher</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
      },
      {
        id: 'capacity',
        accessorKey: 'capacity',
        size: 100,
        header: () => <p className='column-title'>Capacity</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<number>()}</span>,
      },
      {
        id: 'details',
        size: 140,
        header: () => <p className='column-title'>Details</p>,
        cell: ({ row }) => (
          <Button 
            variant='ghost' 
            size='sm'
            onClick={() => show('classes', row.original.id)}
          >
            View
          </Button>
        ),
      },
      {
        id: 'delete',
        size: 140,
        header: () => <p className='column-title'>Actions</p>,
        cell: ({ row }) => <DeleteButton resource='classes' recordItemId={String(row.original.id)} variant='destructive' size='sm' />
      }
    ], [show]),
    refineCoreProps: {
      resource: 'classes',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: classesFilter,
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

  if(isLoading || isError || !department) {
    return(
      <ShowView className='department-view department-show'>
        <ShowViewHeader resource='departments' title='Department Details'/>

        <p className='state-message'>
          {isLoading ? 'Loading Department Details...' : isError ? 'Error loading department details' : 'Department details not found'}
        </p>
      </ShowView>
    )
  }

  const { id, name, description, bannerUrl, bannerCldPubId, headTeacher } = department;
  const headTeacherName = headTeacher?.name || 'Unknown';
  const headTeacherInitials = headTeacherName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toLocaleUpperCase()).join('');
  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(headTeacherInitials || "NA")}`;
  
  return (
    <ShowView className='department-view department-show'>
      <ShowViewHeader resource='departments' title='Department Details'/>

      <div className='banner'>
        {bannerUrl ? (
          <AdvancedImage alt="Department Banner" cldImg={bannerPhoto(bannerCldPubId ?? '', name)}/>
        ) : <div className='placeholder'/>}
      </div>

      <Card className='details-card'>
        <div className='details-header'>
          <div>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>
        </div>

        <div className='details-grid'>
          <div className='instructor'>
            <p>Head Teacher</p>
            <div>
              <img src={headTeacher?.image ?? placeholderUrl} alt={headTeacherName} />
              <div>
                <p>{headTeacherName}</p>
                <p>{headTeacher?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator/>

        <div className='teachers'>
          <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5'>Associated Teachers</p>
          <DataTable table={teachersTable}/>
        </div>

        <Separator/>

        <div className='students'>
          <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5'>Associated Students</p>
          <DataTable table={studentsTable}/>
        </div>

        <Separator/>

        <div className='subjects'>
          <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5'>Associated Subjects</p>
          <DataTable table={subjectsTable}/>
        </div>

        <Separator/>

        <div className='classes'>
          <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5'>Associated Classes</p>
          <DataTable table={classesTable}/>
        </div>
      </Card>
    </ShowView>
  )
}

export default DepartmentShow
