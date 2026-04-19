import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  isActive: true,
};

const UserModal = ({ isOpen, onClose, onSave, user, saving = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
        isActive: user.isActive ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!form.email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Ingresa un correo válido.';
    }
    if (!user && !form.password.trim()) newErrors.password = 'La contraseña es obligatoria al crear usuario.';
    if (form.password && form.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      isActive: form.isActive,
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    onSave(payload);
  };

  return (
    <Modal show={isOpen} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Editar usuario' : 'Crear usuario'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="user-name">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="user-email">
            <Form.Label>Correo *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@correo.com"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="user-password">
            <Form.Label>Contraseña {user ? '(opcional)' : '*'}</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={user ? 'Déjala vacía para no cambiarla' : 'Mínimo 6 caracteres'}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="user-role">
                <Form.Label>Rol</Form.Label>
                <Form.Select name="role" value={form.role} onChange={handleChange}>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6} className="d-flex align-items-end">
              <Form.Group controlId="user-is-active" className="mb-2">
                <Form.Check
                  type="checkbox"
                  name="isActive"
                  label="Usuario activo"
                  checked={form.isActive}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
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

export default UserModal;
