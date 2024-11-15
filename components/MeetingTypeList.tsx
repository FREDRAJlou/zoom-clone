'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Textarea } from "@/components/ui/textarea"
import ReactDatePicker from 'react-datepicker'
import { Input } from "@/components/ui/input"



const MeetingTypeList = () => {
  const [meetingState,setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const router = useRouter();
  const {user} = useUser();
  const client = useStreamVideoClient();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description:'',
    link:'',
  })

  const [callDetails, setCallDetails] = useState<Call>();

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  const createMeeting = async () =>{
    if(!client || !user) return;
    try{
        const id = crypto.randomUUID();
        const call = client.call('default',id);

        if(!call) throw new Error('Failed to create call!!!');

        const startAt = values.dateTime.toISOString() ||  (new Date(Date.now())).toISOString();
        const description = values.description || 'Instant meeting';

        await call.getOrCreate({
          data:{
            starts_at: startAt,
            custom:   {
              description
            }
          }
        })

        setCallDetails(call);

        if(!values.description){
          router.push(`meeting/${call.id}`)
        }

    }catch(error){
      console.log(error);
    }
  }
  return (
   <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
     <HomeCard
     img='/icons/add-meeting.svg'
     title='New Meeting'
     description='Start an instant meeting'
     handleClick={()=>setMeetingState('isInstantMeeting')}
     className='bg-orange-1'/>
      <HomeCard
     img='/icons/schedule.svg'
     title='Schedule Meeting'
     description='Plan your meeting'
     handleClick={()=>setMeetingState('isScheduleMeeting')}
     className='bg-blue-1'/>
      <HomeCard
     img='/icons/recordings.svg'
     title='View Recordings'
     description='Checkout your recordings'
     handleClick={()=>router.push('/recordings')}
     className='bg-purple-1'/>
      <HomeCard
     img='/icons/join-meeting.svg'
     title='Join Meeting'
     description='via invitation link'
     handleClick={()=>setMeetingState('isJoiningMeeting')}
     className='bg-yellow-1'/>
     {!callDetails ? <MeetingModal
     isOpen={meetingState==='isScheduleMeeting'}
     onClose={()=>setMeetingState(undefined)}
     title='Create meeting'
     handleClick={createMeeting}
     >
      <div className='flex flex-col gap-2.5'>
        <label className='text-base text-normal text-sky-2 leading-[22px]'>
          Add a description
        </label>
        <Textarea  className='border-dark-1 bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
        onChange={(e)=>{
            setValues({...values,description:e.target.value});
        }}>

        </Textarea>
        <label className='text-base text-normal text-sky-2 leading-[22px]'>
          Select Date and time
        </label>
        <ReactDatePicker
        selected={values.dateTime}
        onChange={(date)=>{
          setValues({...values,dateTime:date!})
        }}
        showTimeSelect
        timeFormat='HH:mm'
        timeIntervals={15}
        timeCaption='time'
        dateFormat='MMMM d, yyyy h:mm aa'
        className='w-full rounded bg-dark-3 p-2 focus: outline-none'
        />
      </div>
      </MeetingModal> :
     <MeetingModal
     isOpen={meetingState==='isScheduleMeeting'}
     onClose={()=>setMeetingState(undefined)}
     title='Meeting created'
     className='text-center'
     buttonText='Copy meeting link'
     handleClick={()=>{
      navigator.clipboard.writeText(meetingLink)
     }}
     image='/icons/checked.svg'
     buttonIcon='/icons/copy.svg'
     />}
     <MeetingModal
     isOpen={meetingState==='isInstantMeeting'}
     onClose={()=>setMeetingState(undefined)}
     title='Start an instant meeting'
     className='text-center'
     buttonText='Start Meeting'
     handleClick={createMeeting}
     />
     <MeetingModal
     isOpen={meetingState==='isJoiningMeeting'}
     onClose={()=>setMeetingState(undefined)}
     title='Enter meeting Link'
     className='text-center'
     buttonText='Join Meeting'
     handleClick={()=>router.push(values.link)}
     >
      <Input placeholder='Meeting link' className='bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>setValues({...values,link:e.target.value})}/>
     </MeetingModal>
   </section>
  )
}

export default MeetingTypeList