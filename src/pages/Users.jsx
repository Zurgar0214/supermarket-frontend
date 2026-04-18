const Users = () => {
  return (
    <div>
      <div className="header-actions">
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Users Administration</h2>
          <p style={{ margin: 0 }}>Manage system users and their roles.</p>
        </div>
        <button>+ Add User</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>USR-01</td>
              <td>Admin User</td>
              <td>admin@supermarket.com</td>
              <td>Administrator</td>
              <td><span style={{ color: 'var(--success-color)' }}>Active</span></td>
              <td>
                <button className="secondary" style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}>Edit</button>
              </td>
            </tr>
            <tr>
              <td>USR-02</td>
              <td>Cashier One</td>
              <td>cashier1@supermarket.com</td>
              <td>Cashier</td>
              <td><span style={{ color: 'var(--success-color)' }}>Active</span></td>
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

export default Users;
