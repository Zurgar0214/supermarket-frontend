import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, Offcanvas, Row, Col } from 'react-bootstrap';

const pageTitles = {
  '/': 'Panel principal',
  '/products': 'Productos',
  '/providers': 'Proveedores',
  '/sales': 'Ventas',
  '/users': 'Usuarios',
};

const navItems = [
  { path: '/', label: 'Panel principal' },
  { path: '/products', label: 'Productos' },
  { path: '/providers', label: 'Proveedores' },
  { path: '/sales', label: 'Ventas' },
  { path: '/users', label: 'Usuarios' },
];

const DashboardLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  return (
    <div className="vh-100 d-flex flex-column" style={{ overflow: 'hidden' }}>
      <Navbar bg="white" expand={false} className="border-bottom px-3 d-md-none">
        <Navbar.Brand className="text-primary fw-bold d-flex align-items-center gap-2">
          <img src="/favicon.png" alt="" height={24} />
          MarketSoft
        </Navbar.Brand>
        <Navbar.Toggle onClick={handleShow} />
      </Navbar>

      <Row className="flex-grow-1 m-0">
        {/* Desktop Sidebar */}
        <Col md={3} lg={2} className="d-none d-md-flex flex-column bg-white border-end p-3 h-100">
          <div className="d-flex align-items-center gap-2 mb-4">
            <img src="/favicon.png" alt="" height={28} />
            <h4 className="text-primary m-0 fw-bold">MarketSoft</h4>
          </div>
          <Nav className="flex-column gap-2">
            {navItems.map((item) => (
              <Nav.Link
                as={NavLink}
                key={item.path}
                to={item.path}
                className={({ isActive }) => `rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-body'}`}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        {/* Mobile Sidebar (Offcanvas) */}
        <Offcanvas show={showSidebar} onHide={handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="text-primary fw-bold d-flex align-items-center gap-2">
              <img src="/favicon.png" alt="" height={24} />
              MarketSoft
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column gap-2">
              {navItems.map((item) => (
                <Nav.Link
                  as={NavLink}
                  key={item.path}
                  to={item.path}
                  onClick={handleClose}
                  className={({ isActive }) => `rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-body'}`}
                >
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <Col className="d-flex flex-column p-0 h-100 bg-light">
          {/* Header */}
          <header className="d-none d-md-flex align-items-center justify-content-between bg-white border-bottom px-4 py-3">
            <h5 className="m-0 text-dark fw-bold">{pageTitles[location.pathname] || 'Panel principal'}</h5>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Administrador</span>
              <div className="avatar">A</div>
            </div>
          </header>
          
          <main className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
            <div className="d-md-none mb-4">
              <h5 className="m-0 text-dark fw-bold">{pageTitles[location.pathname] || 'Panel principal'}</h5>
            </div>
            {children}
          </main>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardLayout;

