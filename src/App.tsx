import Hero from './Layouts/Hero'

function App() {
  
  return (
    <div>
      <div className='scroll-watcher fixed h-[5px] rounded-r-full bg-gradient-to-r from-pink-500 to-indigo-500 top-0 w-full z-50'></div>
      <Hero/>
      <div className="min-h-screen"></div>
    </div>
  )
}

export default App