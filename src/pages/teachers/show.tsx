import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { User } from '@/types'
import { useShow } from '@refinedev/core'
import React from 'react'

const TeacherShow = () => {
  const { query } = useShow<User>({
    resource: 'teachers'
  })

  const teacher = query.data?.data
  const { isLoading, isError } = query

  if (isLoading || isError || !teacher) {
    return (
      <ShowView className='teacher-view teacher-show'>
        <ShowViewHeader resource='teachers' title='Teacher Details' />

        <p className='state-message'>
          {isLoading ? 'Loading Teacher Details...' : isError ? 'Error loading teacher details' : 'Teacher not found'}
        </p>
      </ShowView>
    )
  }

  const { name, email, role, department, image, address, age, gender, joiningDate, bio, phoneNumber, classes, departments } = teacher
  const teacherInitials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toLocaleUpperCase()).join('')
  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || "NA")}`

  return (
    <ShowView className='teacher-view teacher-show'>
      <ShowViewHeader resource='teachers' title='Teacher Details' />

      <Card className='details-card'>
        <div className='details-header'>
          <div className='flex items-center gap-4'>
            <img src={image ?? placeholderUrl} alt={name} className='size-23 rounded-full object-cover flex-shrink-0' />
            <div>
              <h1>{name}</h1>
              <p>{email}</p>
            </div>
          </div>

          <div>
            <Badge variant={role === 'teacher' ? 'default' : 'secondary'}>{role?.toUpperCase()}</Badge>
          </div>
        </div>

        <div className='details-grid grid-cols-3'>
          <div className='instructor'>
            <p>Contact Information</p>
            <div>
              <div>
                <p className='text-lg'>{email}</p>
                <p className='text-lg font-bold text-muted-foreground'>{phoneNumber ? phoneNumber : 'No mobile number provided'}</p>
              </div>
            </div>
          </div>

          <div className='department'>
            <p>Personal Information</p>

            <div>
              <p className='text-lg'>{gender ? `${gender}`.slice(0, 1).toUpperCase() + `${gender}`.slice(1) : 'N/A'}</p>
              <p className='text-lg font-bold'>{age ? `Age: ${age}` : 'Age not provided'}</p>
            </div>
          </div>

          <div className='subject'>
          <p>Joining Date</p>

          <div>
            <p className='text-lg'>{joiningDate ? new Date(joiningDate).toLocaleDateString() : 'Not specified'}</p>
          </div>
        </div>
        </div>

        <Separator />

            <div className='subject'>
              <p>Bio</p>

              <div>
                <p>{bio || 'No bio provided'}</p>
              </div>
            </div>

        <Separator />

        <div className='subject'>
          <p>Address</p>

          <div>
            <p>{address || 'No address provided'}</p>
          </div>
        </div>

        <Separator />

        {departments && departments.length > 0 && (
          <>
            <Separator />

            <div className='subject'>
              <p>Allocated Departments</p>

              <div>
                {departments.map((dept) => (
                  <div key={dept.id} className='mb-3'>
                    <p className='font-semibold'>{dept.name}</p>
                    <p className='text-xs text-muted-foreground'>{dept.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {classes && classes.length > 0 && (
          <>
            <Separator />

            <div className='subject'>
              <p>Allocated Classes</p>

              <div>
                {classes.map((cls) => (
                  <div key={cls.id} className='mb-3'>
                    <p className='font-semibold'>{cls.name}</p>
                    <p className='text-xs text-muted-foreground'>{cls.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>
    </ShowView>
  )
}

export default TeacherShow
