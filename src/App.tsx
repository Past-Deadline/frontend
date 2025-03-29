import './App.css'
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import { useState } from 'react';
function App() {
  const [slider, setSlider] = useState<number>(0)
  return (
    <>
    
        <Header />
        <main>
        <div className="w-full max-w-xs">
  <input type="range" min={0} max="100" value={slider} className="range" step="25" onChange={(e) => setSlider(e.currentTarget.value as any as number)} />
  <div className="flex justify-between px-2.5 mt-2 text-xs">
    <span>|</span>
    <span>|</span>
    <span>|</span>
    <span>|</span>
    <span>|</span>
  </div>
  <div className="flex justify-between px-2.5 mt-2 text-xs">
    <span>1</span>
    <span>2</span>
    <span>3</span>
    <span>4</span>
    <span>5</span>
  </div>
</div>
        </main>
        <Footer />
    </>
  )
}

export default App
