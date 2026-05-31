import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Salaries from './pages/Salaries';
import Reports from './pages/Reports';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/salaries" element={<Salaries />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;