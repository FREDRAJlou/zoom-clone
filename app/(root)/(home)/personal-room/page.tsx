'use client'
import { useGetCallById } from '@/Hooks/useGetCallById'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Table = ({title,description}:{title:string,description:string})=>{
  return(
<div className='flex flex-col gap-2 xl:flex-row items-start'>
  <h1 className='text-base font-medium text-sky-1 lg:text-xl xl:m-w-38'>{title}:</h1>
  <h1 className='truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl'>{description}</h1>
</div>
  )
}

const PersonalRoom = () => {
  const { user }= useUser();
  const meetingId = user?.id;
  const {call} = useGetCallById(meetingId!);
  const client = useStreamVideoClient();
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`
  const router = useRouter();
  const startRoom = async ()=>{
    if(!client || !user) return;

    if(!call){
      const newCall = client.call('default',meetingId!);
      await newCall?.getOrCreate({
      data:{
        starts_at: new Date().toISOString(),
      }
    })}
  //   else{
  //   await call?.getOrCreate({
  //     data:{
  //       starts_at: new Date().toISOString(),
  //     }
  //   })
  // }
    router.push(`/meeting/${meetingId}?personal=true`)
  }
  return (
    <section className='flex size-full flex-col gap-10 text-white '>
    <h1 className='text-3xl font-bold'>
      Personal Room
    </h1>
    <div className='flex flex-col w-full gap-8 xl:max-w-[900px]'>
        <Table title='Topic' description={`${user?.username}'s Meeting Room`}/>
        
        <Table title='Meeting ID' description={meetingId!}/>
        
        <Table title='Invite link' description={meetingLink}/>
    </div>
    <div className='flex gap-5'>
      <Button className='bg-blue-1' onClick={startRoom}>Start Meeting</Button>
      <Button className='bg-dark-3' onClick={()=>{navigator.clipboard.writeText(meetingLink);}}>
       <Image src='/icons/copy.svg' alt='copy' width={20} height={20}/> Copy Invitation
        </Button>
    </div>
</section>
  )
}

export default PersonalRoom