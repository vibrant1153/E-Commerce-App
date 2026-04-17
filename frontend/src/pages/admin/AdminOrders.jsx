import { useState, useEffect } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token || localStorage.getItem('token') || '';

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setOrders(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    }).then(() => fetchOrders());
  };

  return (
    <div>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Manage Orders</h1>
      <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Order ID</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>User ID</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Total</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{o.id}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{o.user_id}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>${o.total}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                  <span style={{
                    padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '999px',
                    ...(o.status === 'completed' ? { backgroundColor: '#d1fae5', color: '#065f46' } : { backgroundColor: '#fef3c7', color: '#92400e' })
                  }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>
                   {o.status !== 'completed' && (
                     <button onClick={() => handleUpdateStatus(o.id, 'completed')} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                       Approve Delivery
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
