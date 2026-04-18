import { useState } from 'react';

const pageTitles = {
  dashboard: 'Panel principal',
  products: 'Productos',
  providers: 'Proveedores',
  sales: 'Ventas',
  users: 'Usuarios',
};

const DashboardLayout = ({ children, activePage, setActivePage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Panel principal' },
    { id: 'products', label: 'Productos' },
    { id: 'providers', label: 'Proveedores' },
    { id: 'sales', label: 'Ventas' },
    { id: 'users', label: 'Usuarios' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {isSidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>🛒 MarketSoft</h2>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-toggle"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <h3 style={{ margin: 0 }}>{pageTitles[activePage] || 'Panel principal'}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Administrador</span>
            <div className="avatar">A</div>
          </div>
        </header>

        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
