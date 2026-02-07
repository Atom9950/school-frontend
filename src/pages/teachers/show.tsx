import { useShow } from '@refinedev/core'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ShowView } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { User } from '@/types'
import React from 'react'

const TeacherShow = () => {
  const { query } = useShow<User>({
    resource: 'teachers'
  })

  const teacher = query.data?.data
  const { isLoading, isError } = query

  if (isLoading || isError || !teacher) {
    return (
      <ShowView>
        <Breadcrumb />
        <p className='state-message'>
          {isLoading ? 'Loading Teacher Details...' : isError ? 'Error loading teacher details' : 'Teacher not found'}
        </p>
      </ShowView>
    )
  }

  return (
    <ShowView>
      <Breadcrumb />

      <div className='flex items-center justify-between mb-8'>
        <h1 className='page-title'>{teacher.name}</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground'>Name</label>
            <p className='text-foreground text-lg'>{teacher.name}</p>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground'>Email</label>
            <p className='text-foreground'>{teacher.email}</p>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground'>Role</label>
            <div className='mt-1'>
              <Badge>{teacher.role}</Badge>
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground'>Department</label>
            <p className='text-foreground'>{teacher.department || 'N/A'}</p>
          </div>
        </div>

        {teacher.image && (
          <div className='flex justify-center md:justify-end'>
            <img 
              src={teacher.image} 
              alt={teacher.name}
              className='w-48 h-48 rounded-lg object-cover'
            />
          </div>
        )}
      </div>

      {teacher.createdAt && (
        <div className='mt-6 text-sm text-muted-foreground'>
          <p>Created: {new Date(teacher.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </ShowView>
  )
}

export default TeacherShow
