import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Form from "./components/Form";
import { Toaster } from "react-hot-toast";

function App() {
  // const [rangeValues, setRangeValues] = useState<[number, number]>([20, 80]);

  return (
    <>
      <Header />
      <main className="p-4 flex flex-col items-center gap-6">
        {/* <h2 className="text-xl font-bold">Vertical Double Range Slider</h2> */}

        {/* <VerticalDoubleRange
          min={0}
          max={100}
          initialValues={rangeValues}
          height={400} // колко пиксела висок да е
          onChange={(vals) => setRangeValues(vals)}
        />

        <p>
          Стойности: <b>{rangeValues[0]}</b> - <b>{rangeValues[1]}</b>
        </p> */}
        <Toaster />
      </main>
      <Footer />
    </>
  );
}

export default App;
