import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Form, Alert, Badge } from 'react-bootstrap';
import SaleModal from '../components/SaleModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { saleService } from '../services/saleservice';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import { formatCurrency, getErrorMessage } from '../utils/formatters';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingSale, setDeletingSale] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSales = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return sales;

    return sales.filter((sale) =>
      `${sale.user?.name} ${sale.id}`.toLowerCase().includes(term)
    );
  }, [sales, search]);

  const openCreateModal = () => {
    setEditingSale(null);
    setModalOpen(true);
  };

  const openEditModal = (sale) => {
    setEditingSale(sale);
    setModalOpen(true);
  };

const handleSave = async (data) => {
  setSaving(true);
  setError('');

  try {
    const rawDetails = data.details || data.items || [];

    const details = rawDetails
      .map(d => ({
        productId: d.productId || d.product?.id,
        quantity: Number(d.quantity)
      }))
      .filter(d => d.productId && d.quantity > 0);

    if (details.length === 0) {
      setError('Debes agregar al menos un producto válido');
      setSaving(false);
      return;
    }

    const payload = {
      ...data,
      details
    };

    if (editingSale) {
      await saleService.update(editingSale.id, payload);
    } else {
      await saleService.create(payload);
    }

    setModalOpen(false);
    setEditingSale(null);
    await loadData();
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setSaving(false);
  }
};

  const requestDelete = (sale) => {
    setDeletingSale(sale);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSale) return;

    setSaving(true);
    setError('');

    try {
      await saleService.delete(deletingSale.id);
      setSales((prev) =>
        prev.filter((s) => s.id !== deletingSale.id)
      );
      setConfirmOpen(false);
      setDeletingSale(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h2 className="fw-bold">Ventas</h2>
          <p className="text-muted">Gestiona las ventas del sistema</p>
        </div>

        <Button onClick={openCreateModal}>
          + Crear venta
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* SEARCH */}
      <Form.Control
        className="mb-3"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="table-responsive bg-white rounded shadow-sm border">
        {loading ? (
          <div className="p-5 text-center">Cargando...</div>
        ) : (
          <Table hover className="m-0">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
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

                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => openEditModal(sale)}
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => requestDelete(sale)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* MODAL */}
      <SaleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        sale={editingSale}
        products={products}
        users={users}
        saving={saving}
      />

      {/* CONFIRM */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Eliminar venta"
        message={`¿Seguro que deseas eliminar esta venta?`}
        confirmLabel={saving ? 'Eliminando...' : 'Eliminar'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingSale(null);
        }}
      />
    </div>
  );
};

export default Sales;