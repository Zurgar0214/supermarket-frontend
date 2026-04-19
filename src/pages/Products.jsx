import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Badge, Form, Alert } from 'react-bootstrap';
import ProductModal from '../components/ProductModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { productService } from '../services/productService';
import { providerService } from '../services/providerService';
import { formatCurrency, getErrorMessage } from '../utils/formatters';

const StockBadge = ({ stock }) => {
  const numericStock = Number(stock || 0);
  if (numericStock === 0) return <Badge bg="danger">Sin stock</Badge>;
  if (numericStock < 20) return <Badge bg="warning" text="dark">Bajo ({numericStock})</Badge>;
  return <Badge bg="success">{numericStock}</Badge>;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsData, providersData] = await Promise.all([
        productService.getAll(),
        providerService.getAll(),
      ]);
      setProducts(productsData);
      setProviders(providersData);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return products;

    return products.filter((product) => {
      const providerName = product.provider?.name || '';
      return [product.name, product.description, providerName]
        .some((value) => String(value || '').toLowerCase().includes(term));
    });
  }, [products, search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError('');
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
      } else {
        await productService.create(formData);
      }
      setModalOpen(false);
      setEditingProduct(null);
      await loadData();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (product) => {
    setDeletingProduct(product);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setSaving(true);
    setError('');
    try {
      await productService.delete(deletingProduct.id);
      setProducts((prev) => prev.filter((product) => product.id !== deletingProduct.id));
      setConfirmOpen(false);
      setDeletingProduct(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row mb-4 gap-3">
        <div>
          <h2 className="mb-1 text-dark fw-bold">Productos</h2>
          <p className="m-0 text-muted">Administra el inventario y su proveedor asociado.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal} disabled={providers.length === 0}>
          + Crear producto
        </Button>
      </div>

      {providers.length === 0 && !loading && (
        <Alert variant="warning">
          Primero debes crear al menos un proveedor para poder registrar productos.
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, descripción o proveedor"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="table-responsive bg-white rounded shadow-sm border">
        {loading ? (
          <div className="text-center p-5 text-muted">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center p-5 text-muted">No se encontraron productos.</div>
        ) : (
          <Table hover className="m-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Nombre</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Descripción</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Precio</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Stock</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Proveedor</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="fw-medium">{product.name}</td>
                  <td className="text-truncate" style={{ maxWidth: '220px' }}>{product.description || '—'}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td><StockBadge stock={product.stock} /></td>
                  <td>{product.provider?.name || '—'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" size="sm" onClick={() => openEditModal(product)}>Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => requestDelete(product)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
        providers={providers}
        saving={saving}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Eliminar producto"
        message={`¿Seguro que deseas eliminar el producto "${deletingProduct?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel={saving ? 'Eliminando...' : 'Eliminar'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingProduct(null);
        }}
      />
    </div>
  );
};

export default Products;
