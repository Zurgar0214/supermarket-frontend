import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { providerService } from '../services/providerService';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/formatters';

const Dashboard = () => {
  const [summary, setSummary] = useState({ products: 0, providers: 0, users: 0, outOfStock: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const [products, providers, users] = await Promise.all([
          productService.getAll(),
          providerService.getAll(),
          userService.getAll(),
        ]);

        setSummary({
          products: products.length,
          providers: providers.length,
          users: users.length,
          outOfStock: products.filter((product) => Number(product.stock || 0) === 0).length,
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <h3 className="stat-label">Productos registrados</h3>
          <p className="stat-value">{loading ? '...' : summary.products}</p>
          <span className="stat-note">{summary.outOfStock} sin stock</span>
        </div>

        <div className="card">
          <h3 className="stat-label">Proveedores</h3>
          <p className="stat-value">{loading ? '...' : summary.providers}</p>
          <span className="stat-note">Conectados desde el backend</span>
        </div>

        <div className="card">
          <h3 className="stat-label">Usuarios</h3>
          <p className="stat-value">{loading ? '...' : summary.users}</p>
          <span className="stat-note">Activos e inactivos</span>
        </div>
      </div>

      <div className="card">
        <h3>Resumen de Ventas</h3>
        <p>Total de ventas: 0</p>
        <p>Productos vendidos: 0</p>
      </div>
    </div>
  );
};

export default Dashboard;
