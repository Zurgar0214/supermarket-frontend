import { useState } from 'react';
import ProductModal from '../components/ProductModal';
import ConfirmDialog from '../components/ConfirmDialog';

// ── Mock providers (replace with API call when available) ────────
const MOCK_PROVIDERS = [
  { id: 1, name: 'AgroFarm Supplies' },
  { id: 2, name: 'Global Dairy Inc.' },
  { id: 3, name: 'Fresh Fields Co.' },
];

// ── Mock initial product data ────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Organic Milk 1L',     description: 'Fresh organic whole milk', price: 2.50,  stock: 120, providerId: 2 },
  { id: 2, name: 'Whole Wheat Bread',   description: 'Artisan whole wheat loaf',  price: 3.00,  stock: 45,  providerId: 3 },
  { id: 3, name: 'Fresh Apples (1 lb)', description: 'Locally sourced red apples', price: 1.20, stock: 200, providerId: 1 },
];

// ── Stock level badge helper ─────────────────────────────────────
const StockBadge = ({ stock }) => {
  if (stock === 0)   return <span className="badge badge-danger">Out of stock</span>;
  if (stock < 20)    return <span className="badge badge-warning">Low ({stock})</span>;
  return               <span className="badge badge-success">{stock}</span>;
};

// ── Provider name lookup helper ──────────────────────────────────
const getProviderName = (providerId) =>
  MOCK_PROVIDERS.find((p) => p.id === providerId)?.name ?? '—';

let nextId = INITIAL_PRODUCTS.length + 1;

const Products = () => {
  const [products, setProducts]         = useState(INITIAL_PRODUCTS);
  const [search, setSearch]             = useState('');
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [deletingId, setDeletingId]     = useState(null);

  // ── Derived: filtered list ───────────────────────────────────
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handlers ────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSave = (formData) => {
    if (editingProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) => p.id === editingProduct.id ? { id: p.id, ...formData } : p)
      );
    } else {
      // Create new
      setProducts((prev) => [...prev, { id: nextId++, ...formData }]);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const requestDelete = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deletingId));
    setConfirmOpen(false);
    setDeletingId(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeletingId(null);
  };

  const deletingName = products.find((p) => p.id === deletingId)?.name;

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="header-actions">
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Products</h2>
          <p style={{ margin: 0 }}>Manage the supermarket&apos;s product inventory.</p>
        </div>
        <button id="btn-add-product" onClick={openCreateModal}>+ Add Product</button>
      </div>

      {/* ── Search ───────────────────────────────────────────── */}
      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          id="product-search"
          placeholder="Search by name or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="table-container">
        {filtered.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', margin: 0 }}>
            No products found.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Provider</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>#{product.id}</td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.description}
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td><StockBadge stock={product.stock} /></td>
                  <td>{getProviderName(product.providerId)}</td>
                  <td>
                    <button
                      className="secondary"
                      style={{ marginRight: '0.5rem', padding: '0.25rem 0.65rem' }}
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      style={{ padding: '0.25rem 0.65rem' }}
                      onClick={() => requestDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
        providers={MOCK_PROVIDERS}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        message={`Are you sure you want to delete "${deletingName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Products;
