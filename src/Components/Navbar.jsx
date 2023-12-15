import React from 'react'

const linkStyle = 'underline-offset-2 hover:underline hover:decoration-wavy decoration-pink-600 transition ease-linear'

function Navbar() {
  return (
    <div className=' text-white  text-center right-0 flex items-center justify-end p-2 gap-3 font-medium z-50 text-xl'>
        <a className={`${linkStyle}`} href="/">Home</a>
        <a className={`${linkStyle}`} href="/about">About</a>
        <a className={`${linkStyle}`} href="#">Contact</a>
    </div>
  )
}

export default Navbar