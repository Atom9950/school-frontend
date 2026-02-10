import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Department, Subject, User } from '@/types'
import { useShow, useList } from '@refinedev/core'
import { AdvancedImage } from '@cloudinary/react';
import { Building2 } from 'lucide-react';
import { bannerPhoto } from '@/lib/cloudinary';

const DepartmentShow = () => {
  const { query } = useShow<Department>({resource: 'departments'});
  
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
          <p>Associated Teachers ({departmentTeachers.length})</p>
          
          {departmentTeachers.length > 0 ? (
            <div className='space-y-3'>
              {departmentTeachers.map((teacher) => {
                const teacherInitials = teacher.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0].toLocaleUpperCase())
                  .join('');
                const placeholderUrl = `https://placehold.co/100x100?text=${encodeURIComponent(teacherInitials || 'NA')}`;

                return (
                  <div key={teacher.id} className='p-3 border rounded-md bg-secondary/10'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={teacher.image ?? placeholderUrl}
                        alt={teacher.name}
                        className='w-12 h-12 rounded-full object-cover'
                      />
                      <div className='flex-1'>
                        <p className='text-lg font-bold text-primary'>{teacher.name}</p>
                        <p className='text-sm text-muted-foreground'>{teacher.email}</p>
                        {teacher.phoneNumber && (
                          <p className='text-sm text-muted-foreground'>{teacher.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No teachers assigned to this department</p>
          )}
        </div>

        <Separator/>

        <div className='subject'>
          <p>Associated Subjects ({departmentSubjects.length})</p>
          
          {departmentSubjects.length > 0 ? (
            <div className='space-y-3'>
              {departmentSubjects.map((subject) => (
                <div key={subject.id} className='p-3 border rounded-md bg-secondary/10'>
                  <p className='text-lg font-bold text-primary'>{subject.name}</p>
                  <p className='text-sm text-muted-foreground'>Code: {subject.code}</p>
                  <p className='text-sm text-muted-foreground mt-2 leading-relaxed'>{subject.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No subjects available for this department</p>
          )}
        </div>
      </Card>
    </ShowView>
  )
}

export default DepartmentShow
