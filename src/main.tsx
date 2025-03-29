import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router, Route} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <Router>
      <Route path="/" Component={App} />
  </Router>
)
