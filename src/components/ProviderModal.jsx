import { useEffect, useState } from 'react';

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

  if (!isOpen) return null;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{provider ? 'Editar proveedor' : 'Crear proveedor'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="provider-name">Nombre *</label>
              <input
                id="provider-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. Distribuidora Central"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="provider-phone">Teléfono</label>
                <input
                  id="provider-phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ej. 3001234567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="provider-city">Ciudad</label>
                <input
                  id="provider-city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ej. Bogotá"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="provider-email">Correo</label>
              <input
                id="provider-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="proveedor@correo.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
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

export default ProviderModal;
