import React from 'react'
import Navbar from './_components/Navbar'

function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
        <Navbar />
      <main className='h-full'>
        {children}
      </main>
    </div>
  )
}

export default MarketingLayout
