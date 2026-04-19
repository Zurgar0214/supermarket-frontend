import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Providers from './pages/Providers';
import Sales from './pages/Sales';
import Users from './pages/Users';

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;

