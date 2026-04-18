import { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import UserModal from '../components/UserModal';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/formatters';

const roleLabel = {
  admin: 'Administrador',
  user: 'Usuario',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return users;

    return users.filter((user) => (
      [user.name, user.email, user.role, user.isActive ? 'activo' : 'inactivo']
        .some((value) => String(value || '').toLowerCase().includes(term))
    ));
  }, [users, search]);

  const openCreateModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError('');
    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
      } else {
        await userService.create(formData);
      }
      setModalOpen(false);
      setEditingUser(null);
      await loadUsers();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (user) => {
    setDeletingUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setSaving(true);
    setError('');
    try {
      await userService.delete(deletingUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== deletingUser.id));
      setConfirmOpen(false);
      setDeletingUser(null);
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
          <h2 style={{ marginBottom: '0.25rem' }}>Usuarios</h2>
          <p style={{ margin: 0 }}>Administra los usuarios, roles y estado de acceso.</p>
        </div>
        <button onClick={openCreateModal}>+ Crear usuario</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, correo, rol o estado"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p className="empty-state">Cargando usuarios...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="empty-state">No se encontraron usuarios.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roleLabel[user.role] || user.role}</td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="secondary compact" onClick={() => openEditModal(user)}>Editar</button>
                    <button className="danger compact" onClick={() => requestDelete(user)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        user={editingUser}
        saving={saving}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Eliminar usuario"
        message={`¿Seguro que deseas eliminar el usuario "${deletingUser?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel={saving ? 'Eliminando...' : 'Eliminar'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingUser(null);
        }}
      />
    </div>
  );
};

export default Users;
