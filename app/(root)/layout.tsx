import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Zoom Clone",
  description: "Video Calling app",
  icons:{
    icon: '/icons/logo.svg'
  }
};

const RootLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) => {
  return (
      <div className='bg-dark-2'>
        <StreamVideoProvider>
      {children}
      </StreamVideoProvider>
      </div>
  )
}

export default RootLayout