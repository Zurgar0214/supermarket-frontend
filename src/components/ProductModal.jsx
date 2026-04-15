import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  providerId: '',
};

const ProductModal = ({ isOpen, onClose, onSave, product, providers }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        providerId: product.providerId,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())         newErrors.name        = 'Name is required.';
    if (!form.description.trim())  newErrors.description = 'Description is required.';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0)
      newErrors.price = 'Enter a valid price (≥ 0).';
    if (form.stock === '' || isNaN(Number(form.stock)) || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      newErrors.stock = 'Enter a valid integer stock (≥ 0).';
    if (!form.providerId)          newErrors.providerId  = 'Select a provider.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      providerId: parseInt(form.providerId, 10),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">

            {/* Name */}
            <div className="form-group">
              <label htmlFor="product-name">Product Name *</label>
              <input
                id="product-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Organic Whole Milk 1L"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="product-description">Description *</label>
              <textarea
                id="product-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief product description..."
                rows={3}
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            {/* Price & Stock side by side */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="product-price">Price ($) *</label>
                <input
                  id="product-price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'input-error' : ''}
                />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="product-stock">Stock (units) *</label>
                <input
                  id="product-stock"
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  className={errors.stock ? 'input-error' : ''}
                />
                {errors.stock && <span className="form-error">{errors.stock}</span>}
              </div>
            </div>

            {/* Provider */}
            <div className="form-group">
              <label htmlFor="product-provider">Provider *</label>
              <select
                id="product-provider"
                name="providerId"
                value={form.providerId}
                onChange={handleChange}
                className={errors.providerId ? 'input-error' : ''}
              >
                <option value="">— Select a provider —</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.providerId && <span className="form-error">{errors.providerId}</span>}
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            <button type="submit">{product ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
