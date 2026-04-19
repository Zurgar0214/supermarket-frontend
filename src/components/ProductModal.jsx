import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  providerId: '',
};

const ProductModal = ({ isOpen, onClose, onSave, product, providers = [], saving = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        stock: product.stock ?? '',
        providerId: product.providerId || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (form.price === '' || Number.isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'Ingresa un precio mayor a 0.';
    }
    if (form.stock === '' || Number.isNaN(Number(form.stock)) || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      newErrors.stock = 'Ingresa un stock entero igual o mayor a 0.';
    }
    if (!form.providerId) newErrors.providerId = 'Selecciona un proveedor.';
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      providerId: form.providerId,
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{product ? 'Editar producto' : 'Crear producto'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="product-name">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Leche entera 1L"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="product-description">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción del producto"
              rows={3}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="product-price">
                <Form.Label>Precio *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="product-stock">
                <Form.Label>Stock *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  isInvalid={!!errors.stock}
                />
                <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="product-provider">
            <Form.Label>Proveedor *</Form.Label>
            <Form.Select
              name="providerId"
              value={form.providerId}
              onChange={handleChange}
              isInvalid={!!errors.providerId}
            >
              <option value="">Selecciona un proveedor</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.providerId}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductModal;
