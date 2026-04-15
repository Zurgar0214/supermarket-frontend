import { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Providers from './pages/Providers';
import Sales from './pages/Sales';
import Users from './pages/Users';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'providers': return <Providers />;
      case 'sales': return <Sales />;
      case 'users': return <Users />;
      default: return <Dashboard />;
    }
  };

  return (
    <DashboardLayout activePage={currentPage} setActivePage={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default App;

