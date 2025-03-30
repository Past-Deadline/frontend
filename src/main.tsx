import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import { PreviewPage } from './pages/PreviewPage.tsx';
import { MapFormPage } from './pages/MapFormPage.tsx';

createRoot(document.getElementById('root')!).render(
  <Router>
      <Routes>
        <Route index element={<Navigate replace to="/preview" />} />
        <Route path="/preview" Component={PreviewPage} />
        <Route path="/scheduler" Component={MapFormPage} />
      </Routes>
  </Router>
)
