import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Dashboard from './pages/Dashboard';
import ConfigDiff from './pages/ConfigDiff';
import ROIDashboard from './pages/ROIDashboard';
import { getUILabels } from './services/api';
import { DEFAULT_LABELS } from './services/config';

// Create context for labels
export const LabelsContext = createContext(DEFAULT_LABELS);

function App() {
  const [labels, setLabels] = useState(DEFAULT_LABELS);

  // Fetch labels in background but don't block render
  useEffect(() => {
    getUILabels()
      .then(data => {
        setLabels({ ...DEFAULT_LABELS, ...data });
      })
      .catch(err => {
        console.warn('Using default labels:', err);
      });
  }, []);

  return (
    <LabelsContext.Provider value={labels}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/config-diff/:id" element={<ConfigDiff />} />
          <Route path="/roi" element={<ROIDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LabelsContext.Provider>
  );
}

export default App;

