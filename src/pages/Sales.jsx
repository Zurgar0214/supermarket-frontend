import { Button, Card } from 'react-bootstrap';

const Sales = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row mb-4 gap-3">
        <div>
          <h2 className="mb-1 text-dark fw-bold">Ventas</h2>
          <p className="m-0 text-muted">Este módulo queda listo para conectarse después de usuarios, proveedores y productos.</p>
        </div>
        <Button variant="primary" disabled>+ Nueva venta</Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold mb-3">Próximo paso</Card.Title>
          <Card.Text className="text-muted">
            El backend ya tiene endpoints para ventas y detalles de venta. Para conectarlo bien, conviene primero
            validar que existan productos y usuarios creados, porque una venta depende de ambos.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Sales;
