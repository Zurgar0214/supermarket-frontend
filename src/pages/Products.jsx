import { useEffect, useMemo, useState } from 'react';
import ProductModal from '../components/ProductModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { productService } from '../services/productService';
import { providerService } from '../services/providerService';
import { formatCurrency, getErrorMessage } from '../utils/formatters';

const StockBadge = ({ stock }) => {
  const numericStock = Number(stock || 0);
  if (numericStock === 0) return <span className="badge badge-danger">Sin stock</span>;
  if (numericStock < 20) return <span className="badge badge-warning">Bajo ({numericStock})</span>;
  return <span className="badge badge-success">{numericStock}</span>;
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
      <div className="header-actions">
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Productos</h2>
          <p style={{ margin: 0 }}>Administra el inventario y su proveedor asociado.</p>
        </div>
        <button onClick={openCreateModal} disabled={providers.length === 0}>+ Crear producto</button>
      </div>

      {providers.length === 0 && !loading && (
        <div className="alert alert-warning">
          Primero debes crear al menos un proveedor para poder registrar productos.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, descripción o proveedor"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p className="empty-state">Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="empty-state">No se encontraron productos.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td className="truncate-cell">{product.description || '—'}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td><StockBadge stock={product.stock} /></td>
                  <td>{product.provider?.name || '—'}</td>
                  <td className="actions-cell">
                    <button className="secondary compact" onClick={() => openEditModal(product)}>Editar</button>
                    <button className="danger compact" onClick={() => requestDelete(product)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
