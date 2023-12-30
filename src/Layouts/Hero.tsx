import { useState, useEffect } from "react";
import Cursor from "../Components/Cursor";

function Hero() {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  useEffect(() => {
    function trackMouseMovement(e: any) {
      setX(e.clientX);
      setY(e.clientY);
    }
    document.addEventListener("mousemove", trackMouseMovement);
    return () => {
      document.removeEventListener("mousemove", trackMouseMovement);
    };
  }, [x, y]);
  return (
    <div>
      <Cursor x={x} y={y} />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold">Hello fello Developers!</h2>
      </div>
    </div>
  );
}

export default Hero;
