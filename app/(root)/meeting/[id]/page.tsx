'use client'
import { useGetCallById } from '@/Hooks/useGetCallById';
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { use, useState } from 'react'

export default function Meeting ({
  params,
}: {
  params: { id: string }
}) {
  const {user,isLoaded} = useUser();
  const meetingId = (params).id;
  console.log("Meeting Id : "+meetingId);
const [isSetupComplete, setIsSetupComplete] = useState(false)
const {call,isCallLoading} = useGetCallById(meetingId);
  
if(!isLoaded || isCallLoading) return <Loader/>
  return (
    // <div>Meeting Room No: {(await params).id}</div>
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme as={'main'}>
          {!isSetupComplete?<MeetingSetup setIsSetupComplete={setIsSetupComplete}/>:<MeetingRoom/>}
        </StreamTheme>
      </StreamCall>
    </main>
  )
  }