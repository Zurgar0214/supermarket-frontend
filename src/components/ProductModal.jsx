import { useEffect, useState } from 'react';

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

  if (!isOpen) return null;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product ? 'Editar producto' : 'Crear producto'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="product-name">Nombre *</label>
              <input
                id="product-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. Leche entera 1L"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="product-description">Descripción</label>
              <textarea
                id="product-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="product-price">Precio *</label>
                <input
                  id="product-price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className={errors.price ? 'input-error' : ''}
                />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="product-stock">Stock *</label>
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

            <div className="form-group">
              <label htmlFor="product-provider">Proveedor *</label>
              <select
                id="product-provider"
                name="providerId"
                value={form.providerId}
                onChange={handleChange}
                className={errors.providerId ? 'input-error' : ''}
              >
                <option value="">Selecciona un proveedor</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
                ))}
              </select>
              {errors.providerId && <span className="form-error">{errors.providerId}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
