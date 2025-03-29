import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { PreviewPage } from './pages/PreviewPage.tsx';

createRoot(document.getElementById('root')!).render(
  <Router>
      <Routes>
        <Route index Component={App} />
        <Route path="/preview" Component={PreviewPage} />
      </Routes>
  </Router>
)
