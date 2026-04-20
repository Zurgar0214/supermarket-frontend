import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Form, Alert, Badge } from 'react-bootstrap';
import { saleService } from '../services/saleService';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { formatCurrency, getErrorMessage } from '../utils/formatters';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Modal simple integrado
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [items, setItems] = useState([]);

  // 🔄 LOAD DATA
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [salesData, productsData, usersData] = await Promise.all([
        saleService.getAll(),
        productService.getAll(),
        userService.getAll(),
      ]);

      setSales(salesData);
      setProducts(productsData);
      setUsers(usersData);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔍 FILTRO
  const filteredSales = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return sales;

    return sales.filter((sale) => {
      const userName = sale.user?.name || '';
      return [userName, sale.id]
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [sales, search]);

  // ➕ ADD PRODUCT
  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // 💾 SAVE SALE
  const handleSave = async () => {
    if (!selectedUser || items.length === 0) {
      alert('Completa los campos');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await saleService.create({
        userId: selectedUser,
        products: items,
      });

      setModalOpen(false);
      setItems([]);
      setSelectedUser('');
      await loadData();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row mb-4 gap-3">
        <div>
          <h2 className="mb-1 text-dark fw-bold">Ventas</h2>
          <p className="m-0 text-muted">Gestiona las ventas del sistema.</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + Crear venta
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* SEARCH */}
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar por usuario o ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="table-responsive bg-white rounded shadow-sm border">
        {loading ? (
          <div className="text-center p-5 text-muted">Cargando ventas...</div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center p-5 text-muted">No hay ventas.</div>
        ) : (
          <Table hover className="m-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Productos</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.user?.name}</td>
                  <td>{formatCurrency(sale.total)}</td>
                  <td>{new Date(sale.createdAt).toLocaleDateString()}</td>

                  <td>
                    {sale.saleDetails?.map((d, i) => (
                      <Badge key={i} bg="secondary" className="me-1">
                        {d.product?.name} x {d.quantity}
                      </Badge>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* 🧾 MODAL */}
      {modalOpen && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Crear Venta</h5>

              {/* USER */}
              <Form.Select
                className="mb-3"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Selecciona usuario</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Form.Select>

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

              <div className="mt-3 d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;