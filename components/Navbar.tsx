import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className='fixed bg-none text-white z-50 p-4'>
        <div className='text-4xl italic'>
            EduShare
        </div>
    </nav>
  )
}

export default Navbar