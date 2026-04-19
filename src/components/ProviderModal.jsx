import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  city: '',
};

const ProviderModal = ({ isOpen, onClose, onSave, provider, saving = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (provider) {
      setForm({
        name: provider.name || '',
        phone: provider.phone || '',
        email: provider.email || '',
        city: provider.city || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [provider, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre del proveedor es obligatorio.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Ingresa un correo válido.';
    }
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
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{provider ? 'Editar proveedor' : 'Crear proveedor'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="provider-name">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Distribuidora Central"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="provider-phone">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ej. 3001234567"
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="provider-city">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ej. Bogotá"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="provider-email">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="proveedor@correo.com"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
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

export default ProviderModal;
