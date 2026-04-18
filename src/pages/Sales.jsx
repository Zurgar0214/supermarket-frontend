const Sales = () => {
  return (
    <div>
      <div className="header-actions">
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Sales Register</h2>
          <p style={{ margin: 0 }}>Register new sales and view past transactions.</p>
        </div>
        <button>+ New Sale</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>Date</th>
              <th>Customer / User</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RCPT-10045</td>
              <td>Oct 24, 2026</td>
              <td>Walk-in Customer</td>
              <td>$45.50</td>
              <td><span style={{ color: 'var(--success-color)' }}>Completed</span></td>
              <td><button className="secondary" style={{ padding: '0.25rem 0.5rem' }}>View</button></td>
            </tr>
            <tr>
              <td>RCPT-10046</td>
              <td>Oct 24, 2026</td>
              <td>Alice Smith</td>
              <td>$124.00</td>
              <td><span style={{ color: 'var(--success-color)' }}>Completed</span></td>
              <td><button className="secondary" style={{ padding: '0.25rem 0.5rem' }}>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
