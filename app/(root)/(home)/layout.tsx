import Navbar from '@/components/navbar'
import Sidebar from '@/components/Sidebar'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Zoom Clone",
  description: "Video Calling app",
  icons:{
    icon: '/icons/logo.svg'
  }
};

const HomeLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) => {
  return (
    <div className='relative'>
      <Navbar></Navbar>
      <div className='flex'>
        <Sidebar></Sidebar>
        <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
          <div className='w-full'>
          {children}
          </div>
        </section>
      </div>
     
    </div>
  )
}

export default HomeLayout