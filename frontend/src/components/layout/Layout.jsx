import React from 'react'
import Navbar from './Navbar'

const Layout = ({children}) => {
  //The bg-base-100 is comming from class we intialized in the tailwindConfig, 
  return (
    <div className='min-h-screen bg-base-100 '>
        <Navbar/>
        <main className='max-w-7xl mx-auto px-3 py-6'>{children}</main>
    </div>
  )
}

export default Layout
