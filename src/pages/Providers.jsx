const Providers = () => {
  return (
    <div>
      <div className="header-actions">
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Providers</h2>
          <p style={{ margin: 0 }}>Manage your suppliers and distributors.</p>
        </div>
        <button>+ Add Provider</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company Name</th>
              <th>Contact Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PROV-001</td>
              <td>AgroFarm Supplies</td>
              <td>John Doe</td>
              <td>(555) 123-4567</td>
              <td><span style={{ color: 'var(--success-color)', fontWeight: 500 }}>Active</span></td>
              <td>
                <button className="secondary" style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}>Edit</button>
              </td>
            </tr>
            <tr>
              <td>PROV-002</td>
              <td>Global Dairy Inc.</td>
              <td>Jane Smith</td>
              <td>(555) 987-6543</td>
              <td><span style={{ color: 'var(--success-color)', fontWeight: 500 }}>Active</span></td>
              <td>
                <button className="secondary" style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}>Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Providers;
