import { useEffect, useMemo, useState } from 'react';
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
      <div className="header-actions">
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Proveedores</h2>
          <p style={{ margin: 0 }}>Administra los proveedores que abastecen tus productos.</p>
        </div>
        <button onClick={openCreateModal}>+ Crear proveedor</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono, correo o ciudad"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p className="empty-state">Cargando proveedores...</p>
        ) : filteredProviders.length === 0 ? (
          <p className="empty-state">No se encontraron proveedores.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Ciudad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) => (
                <tr key={provider.id}>
                  <td style={{ fontWeight: 500 }}>{provider.name}</td>
                  <td>{provider.phone || '—'}</td>
                  <td>{provider.email || '—'}</td>
                  <td>{provider.city || '—'}</td>
                  <td className="actions-cell">
                    <button className="secondary compact" onClick={() => openEditModal(provider)}>Editar</button>
                    <button className="danger compact" onClick={() => requestDelete(provider)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
