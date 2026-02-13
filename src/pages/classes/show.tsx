import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClassDetails } from '@/types'
import { useShow } from '@refinedev/core'
import { AdvancedImage } from '@cloudinary/react';
import React from 'react'
import { en } from 'zod/v4/locales';
import { bannerPhoto } from '@/lib/cloudinary';

const show = () => {
  const { query } = useShow<ClassDetails>({resource: 'classes'});

  const classDetails = query.data?.data;
  const {isLoading, isError} = query
  

  if(isLoading || isError || !classDetails) {
    return(
      <ShowView className='class-view class-show'>
        <ShowViewHeader resource='classes' title='Class Details'/>

        <p className='state-message'>
          {isLoading ? 'Loading Class Details...' : isError ? 'Error loading class details' : 'Class details not found'}
        </p>
      </ShowView>
    )
  }

  const teacherName = classDetails.teacher?.name || 'Unknown';
  const teacherInitials = teacherName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toLocaleUpperCase()).join('');
    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || "NA")}`;
  const subjectName = classDetails.subject?.name || 'N/A';

  const { id, name, description, status, capacity, courseCode, courseName, bannerUrl, bannerCldPubId, subject, teacher, department, schedules, inviteCode, totalStudents} = classDetails;
  return (
    <ShowView className='class-view class-show'>
      <ShowViewHeader resource='classes' title='Class Details'/>

      <div className='banner'>
        {bannerUrl ? (
          <AdvancedImage alt="Class Banner" cldImg={bannerPhoto(bannerCldPubId ?? '', name)}/>
        ) : <div className='placeholder'/>}
      </div>

      <Card className='details-card'>
        <div className='details-header'>
          <div>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>

          <div><Badge variant='outline'>{capacity} spots</Badge>
               <Badge variant={status == 'active' ? 'default' : 'secondary'}>{status.toUpperCase()}</Badge>
               <Badge variant='outline'>{totalStudents ?? 0} students</Badge>
          </div>
        </div>

        <div className='details-grid'>
          <div className='instructor'>
            <p>Instructor</p>
            <div> 
              <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />

              <div>
                <p>{teacherName}</p>
                <p>{teacher?.email}</p>
                <p>{teacher?.phoneNumber || 'No mobile number provided'}</p>
              </div>
            </div>
          </div>

          <div className='department'>
            <p>Department</p>

            <div>
            <p>{department?.name}</p>
            <p>{department?.description}</p>
            </div>
          </div>
        </div>

        <Separator/>

        <div className='subject'>
          <p>Subject</p>

          <div>
            <Badge variant='outline'>Code: {subject?.code}</Badge>
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>

        <Separator/>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'flex-start'
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Total Allocated Students</p>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#7c9082'
          }}>{totalStudents ?? 0}</p>
        </div>
      </Card>
    </ShowView>
  )
}

export default show
