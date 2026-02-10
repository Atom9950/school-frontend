import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useShow } from '@refinedev/core'
import React from 'react'

interface Student {
  id: number
  name: string
  email: string
  age: number
  gender: string
  fathersName?: string
  mothersName?: string
  address?: string
  phoneNumber?: string
  whatsappNumber?: string
  admissionDate: string
  department?: {
    id: number
    name: string
  }
  rollNumber?: string
  image?: string
}

const StudentShow = () => {
  const { query } = useShow<Student>({
    resource: 'students'
  })

  const student = query.data?.data
  const { isLoading, isError } = query

  if (isLoading || isError || !student) {
    return (
      <ShowView className='student-view student-show'>
        <ShowViewHeader resource='students' title='Student Details' />

        <p className='state-message'>
          {isLoading ? 'Loading Student Details...' : isError ? 'Error loading student details' : 'Student not found'}
        </p>
      </ShowView>
    )
  }

  const { name, email, age, gender, fathersName, mothersName, address, phoneNumber, whatsappNumber, admissionDate, department, rollNumber, image } = student
  const studentInitials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toLocaleUpperCase()).join('')
  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(studentInitials || "NA")}`

  return (
    <ShowView className='student-view student-show'>
      <ShowViewHeader resource='students' title='Student Details' />

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
            <Badge variant='default'>STUDENT</Badge>
          </div>
        </div>

        <div className='details-grid grid-cols-3'>
          <div className='instructor'>
            <p>Contact Information</p>
            <div>
              <div>
                <p className='text-lg'>{email}</p>
                <p className='text-lg font-bold text-muted-foreground'>{phoneNumber ? phoneNumber : 'No phone number provided'}</p>
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
            <p>Admission Date</p>

            <div>
              <p className='text-lg'>{admissionDate ? new Date(admissionDate).toLocaleDateString() : 'Not specified'}</p>
            </div>
          </div>
        </div>

        <Separator />

        {(rollNumber || department) && (
          <>
            <div className='grid grid-cols-2 gap-6'>
              {rollNumber && (
                <div className='subject'>
                  <p>Roll Number</p>
                  <div>
                    <p>{rollNumber}</p>
                  </div>
                </div>
              )}

              {department && (
                <div className='subject'>
                  <p>Department</p>
                  <div>
                    <p className='font-semibold'>{department.name}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />
          </>
        )}

        {whatsappNumber && (
          <>
            <div className='subject'>
              <p>WhatsApp Number</p>

              <div>
                <p>{whatsappNumber}</p>
              </div>
            </div>

            <Separator />
          </>
        )}

        {(fathersName || mothersName) && (
          <>
            <div className='grid grid-cols-2 gap-6'>
              {fathersName && (
                <div className='subject'>
                  <p>Father's Name</p>
                  <div>
                    <p>{fathersName}</p>
                  </div>
                </div>
              )}

              {mothersName && (
                <div className='subject'>
                  <p>Mother's Name</p>
                  <div>
                    <p>{mothersName}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />
          </>
        )}

        {address && (
          <>
            <div className='subject'>
              <p>Address</p>

              <div>
                <p>{address}</p>
              </div>
            </div>
          </>
        )}
      </Card>
    </ShowView>
  )
}

export default StudentShow
