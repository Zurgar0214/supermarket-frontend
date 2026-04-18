const Sales = () => {
  return (
    <div>
      <div className="header-actions">
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Ventas</h2>
          <p style={{ margin: 0 }}>Este módulo queda listo para conectarse después de usuarios, proveedores y productos.</p>
        </div>
        <button disabled>+ Nueva venta</button>
      </div>

      <div className="card">
        <h3>Próximo paso</h3>
        <p>
          El backend ya tiene endpoints para ventas y detalles de venta. Para conectarlo bien, conviene primero
          validar que existan productos y usuarios creados, porque una venta depende de ambos.
        </p>
      </div>
    </div>
  );
};

export default Sales;
