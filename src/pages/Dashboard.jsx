import { useEffect, useState } from 'react';
import { Alert, Card, Row, Col } from 'react-bootstrap';
import { productService } from '../services/productService';
import { providerService } from '../services/providerService';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/formatters';

const Dashboard = () => {
  const [summary, setSummary] = useState({ products: 0, providers: 0, users: 0, outOfStock: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const [products, providers, users] = await Promise.all([
          productService.getAll(),
          providerService.getAll(),
          userService.getAll(),
        ]);

        setSummary({
          products: products.length,
          providers: providers.length,
          users: users.length,
          outOfStock: products.filter((product) => Number(product.stock || 0) === 0).length,
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4 g-4">
        <Col md={4} sm={12}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Productos registrados</h6>
              <h2 className="display-5 fw-bold text-dark mb-1">{loading ? '...' : summary.products}</h2>
              <small className="text-muted">{summary.outOfStock} sin stock</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={12}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Proveedores</h6>
              <h2 className="display-5 fw-bold text-dark mb-1">{loading ? '...' : summary.providers}</h2>
              <small className="text-muted">Conectados desde el backend</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={12}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Usuarios</h6>
              <h2 className="display-5 fw-bold text-dark mb-1">{loading ? '...' : summary.users}</h2>
              <small className="text-muted">Activos e inactivos</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold mb-3">Resumen de Ventas</Card.Title>
          <Card.Text className="text-muted mb-1">Total de ventas: 0</Card.Text>
          <Card.Text className="text-muted">Productos vendidos: 0</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
