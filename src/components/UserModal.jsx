import { useEffect, useState } from 'react';

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

  if (!isOpen) return null;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? 'Editar usuario' : 'Crear usuario'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="user-name">Nombre *</label>
              <input
                id="user-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="user-email">Correo *</label>
              <input
                id="user-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="usuario@correo.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="user-password">Contraseña {user ? '(opcional)' : '*'}</label>
              <input
                id="user-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={user ? 'Déjala vacía para no cambiarla' : 'Mínimo 6 caracteres'}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="user-role">Rol</label>
                <select id="user-role" name="role" value={form.role} onChange={handleChange}>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <label className="checkbox-field" htmlFor="user-is-active">
                <input
                  id="user-is-active"
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Usuario activo
              </label>
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

export default UserModal;
