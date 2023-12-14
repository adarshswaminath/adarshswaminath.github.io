import React from 'react'

const linkStyle = 'underline-offset-2 hover:underline hover:decoration-wavy decoration-pink-600 transition ease-linear'

function Navbar() {
  return (
    <div className='sticky top-0 left-0 bg-black/20 flex items-center justify-end text-white p-2 space-x-4 font-medium'>
        <a className={`${linkStyle}`} href="#">About</a>
        <a className={`${linkStyle}`} href="#">Contact</a>
        <a className={`${linkStyle}`} href="#">Projects</a>
    </div>
  )
}

export default Navbar