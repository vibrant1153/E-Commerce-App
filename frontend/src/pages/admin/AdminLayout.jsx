import { Outlet, Link, useLocation } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Users', path: '/admin/users' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ width: '256px', backgroundColor: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>Admin Panel</h2>
        </div>
        <nav style={{ marginTop: '24px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'block',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isActive ? '#fff' : '#9ca3af',
                  backgroundColor: isActive ? '#1f2937' : 'transparent',
                  borderLeft: isActive ? '4px solid #6366f1' : 'none',
                  textDecoration: 'none'
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '32px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
