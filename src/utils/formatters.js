export const formatCurrency = (value) => {
  const numberValue = Number(value || 0);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
  }).format(numberValue);
};

export const shortId = (id) => {
  if (!id) return '—';
  return String(id).slice(0, 8);
};

export const getErrorMessage = (error) => (
  error?.friendlyMessage || error?.message || 'Ocurrió un error inesperado.'
);
