const Dashboard = () => {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Sales</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0.5rem 0' }}>$12,450.00</p>
          <span style={{ color: 'var(--success-color)', fontSize: '0.875rem' }}>+15% from last month</span>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Active Products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0.5rem 0' }}>342</p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>12 out of stock</span>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Providers</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0.5rem 0' }}>24</p>
          <span style={{ color: 'var(--accent-color)', fontSize: '0.875rem' }}>2 new this week</span>
        </div>
      </div>

      <div className="card">
        <h2>Recent Activity</h2>
        <p>No recent activity right now.</p>
      </div>
    </div>
  );
};

export default Dashboard;
