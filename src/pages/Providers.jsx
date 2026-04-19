import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import ConfirmDialog from '../components/ConfirmDialog';
import ProviderModal from '../components/ProviderModal';
import { providerService } from '../services/providerService';
import { getErrorMessage } from '../utils/formatters';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingProvider, setDeletingProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await providerService.getAll();
      setProviders(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return providers;

    return providers.filter((provider) => (
      [provider.name, provider.phone, provider.email, provider.city]
        .some((value) => String(value || '').toLowerCase().includes(term))
    ));
  }, [providers, search]);

  const openCreateModal = () => {
    setEditingProvider(null);
    setModalOpen(true);
  };

  const openEditModal = (provider) => {
    setEditingProvider(provider);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError('');
    try {
      if (editingProvider) {
        await providerService.update(editingProvider.id, formData);
      } else {
        await providerService.create(formData);
      }
      setModalOpen(false);
      setEditingProvider(null);
      await loadProviders();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (provider) => {
    setDeletingProvider(provider);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProvider) return;
    setSaving(true);
    setError('');
    try {
      await providerService.delete(deletingProvider.id);
      setProviders((prev) => prev.filter((provider) => provider.id !== deletingProvider.id));
      setConfirmOpen(false);
      setDeletingProvider(null);
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
          <h2 className="mb-1 text-dark fw-bold">Proveedores</h2>
          <p className="m-0 text-muted">Administra los proveedores que abastecen tus productos.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>+ Crear proveedor</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, teléfono, correo o ciudad"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="table-responsive bg-white rounded shadow-sm border">
        {loading ? (
          <div className="text-center p-5 text-muted">Cargando proveedores...</div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center p-5 text-muted">No se encontraron proveedores.</div>
        ) : (
          <Table hover className="m-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Nombre</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Teléfono</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Correo</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Ciudad</th>
                <th className="text-uppercase text-secondary" style={{ fontSize: '0.85rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) => (
                <tr key={provider.id}>
                  <td className="fw-medium">{provider.name}</td>
                  <td>{provider.phone || '—'}</td>
                  <td>{provider.email || '—'}</td>
                  <td>{provider.city || '—'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" size="sm" onClick={() => openEditModal(provider)}>Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => requestDelete(provider)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <ProviderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        provider={editingProvider}
        saving={saving}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Eliminar proveedor"
        message={`¿Seguro que deseas eliminar el proveedor "${deletingProvider?.name}"? Si tiene productos asociados, el backend puede rechazar o aplicar la regla configurada.`}
        confirmLabel={saving ? 'Eliminando...' : 'Eliminar'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingProvider(null);
        }}
      />
    </div>
  );
};

export default Providers;
