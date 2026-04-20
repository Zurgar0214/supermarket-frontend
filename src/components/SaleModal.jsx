import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SaleModal = ({ isOpen, onClose, onSave, products, users, saving }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedUser('');
      setItems([]);
    }
  }, [isOpen]);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (!selectedUser || items.length === 0) {
      alert('Completa los campos');
      return;
    }

    onSave({
      userId: selectedUser,
      items: items,
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* USER */}
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Selecciona usuario</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* PRODUCTS */}
        {items.map((item, index) => (
          <div key={index} className="d-flex gap-2 mb-2">
            <Form.Select
              value={item.productId}
              onChange={(e) =>
                updateItem(index, 'productId', e.target.value)
              }
            >
              <option value="">Producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock})
                </option>
              ))}
            </Form.Select>

            <Form.Control
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, 'quantity', Number(e.target.value))
              }
            />
          </div>
        ))}

        <Button variant="secondary" size="sm" onClick={addItem}>
          + Agregar producto
        </Button>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SaleModal;