import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Badge, Form, Alert } from 'react-bootstrap';
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
      <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row mb-4 gap-3">
        <div>
          <h2 className="mb-1 text-dark fw-bold">Usuarios</h2>
          <p className="m-0 text-muted">Administra los usuarios, roles y estado de acceso.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>+ Crear usuario</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, correo, rol o estado"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="table-responsive bg-white rounded shadow-sm border">
        {loading ? (
          <div className="text-center p-5 text-muted">Cargando usuarios...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-5 text-muted">No se encontraron usuarios.</div>
        ) : (
          <Table hover className="m-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Nombre</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Correo</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Rol</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Estado</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="fw-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roleLabel[user.role] || user.role}</td>
                  <td>
                    <Badge bg={user.isActive ? 'success' : 'danger'}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" size="sm" onClick={() => openEditModal(user)}>Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => requestDelete(user)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
