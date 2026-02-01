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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch labels from API
    getUILabels()
      .then(data => {
        setLabels({ ...DEFAULT_LABELS, ...data });
      })
      .catch(err => {
        console.warn('Using default labels:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-layout" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="badge badge-success badge-pulse">
            {DEFAULT_LABELS.processing}
          </div>
        </div>
      </div>
    );
  }

  return (
    <LabelsContext.Provider value={labels}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/config-diff/:id" element={<ConfigDiff />} />
          <Route path="/roi" element={<ROIDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LabelsContext.Provider>
  );
}

export default App;
