import './App.css'
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Slider from './components/Slider.tsx';
import Checkbox from './components/checkbox.tsx';
import  RangeSlider from './components/RangeSlider.tsx';
import VerticalDoubleSlider from './components/RangeSlider.tsx';
import { useState } from 'react';
// import {RangeSlider} from './components/RangeSlider.tsx';
function App() {
  const [values, setValues] = useState<[number, number]>([30, 70]);
  return (
    <>
    
        <Header />
        <main>
          {/* <Slider/> */}
        <VerticalDoubleSlider
          min={0}
          max={100}
          initialValues={values}
          onChange={setValues}
          height={400}
        />
          {/* <Checkbox/> */}
        </main>
        <Footer />
    </>
  )
}

export default App
