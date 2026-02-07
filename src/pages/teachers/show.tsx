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

  const { name, email, role, department, image, address, age, gender, joiningDate, classes, departments } = teacher

  return (
    <ShowView className='teacher-view teacher-show'>
      <ShowViewHeader resource='teachers' title='Teacher Details' />

      <div className='banner'>
        {image ? (
          <img alt='Teacher Banner' src={image} />
        ) : (
          <div className='placeholder' />
        )}
      </div>

      <Card className='details-card'>
        <div className='details-header'>
          <div>
            <h1>{name}</h1>
            <p>{email}</p>
          </div>

          <div>
            <Badge variant={role === 'teacher' ? 'default' : 'secondary'}>{role?.toUpperCase()}</Badge>
          </div>
        </div>

        <div className='details-grid'>
          <div className='instructor'>
            <p>Contact Information</p>
            <div>
              <div>
                <p>{email}</p>
              </div>
            </div>
          </div>

          <div className='department'>
            <p>Personal Information</p>

            <div>
              <p>{gender ? `${gender}` : 'N/A'}</p>
              <p>{age ? `Age: ${age}` : 'Age not provided'}</p>
            </div>
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

        <div className='subject'>
          <p>Joining Date</p>

          <div>
            <p>{joiningDate ? new Date(joiningDate).toLocaleDateString() : 'Not specified'}</p>
          </div>
        </div>

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
