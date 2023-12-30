import React from "react"
 interface CursorProps {
    x: number;
    y: number;
 }

const Cursor: React.FC<CursorProps> = ({x,y}) => {
  return (
    <div style={{
        left: x,
        top: y,
    }} className='wrapper  bg-white rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference'>
        <p><span></span></p>
        <p><span></span></p>
    </div>
  )
}

export default Cursor