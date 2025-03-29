import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PreviewMap from "./components/PreviewMap.tsx";

createRoot(document.getElementById('root')!).render(
  <Router>
      <Routes>
        <Route index Component={App} />
        <Route path="/map" Component={PreviewMap} />
      </Routes>
  </Router>
)
