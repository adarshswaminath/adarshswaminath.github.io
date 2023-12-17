import React from 'react'

const linkStyle = 'underline-offset-2 hover:underline hover:decoration-wavy decoration-[#ff4911] transition ease-linear'

function Navbar() {
  return (
    <div className='bg-white text-black  text-center right-0 flex items-center justify-end p-3 h-14 border-b-4 border-black gap-3 font-medium z-50 text-xl'>
        <a className={`${linkStyle}`} href="/">Home</a>
        <a className={`${linkStyle}`} href="/about">About</a>
        <a className={`${linkStyle}`} href="#">Contact</a>
    </div>
  )
}

export default Navbar