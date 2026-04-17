import { useState, useEffect } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token || localStorage.getItem('token') || '';

  const fetchUsers = () => {
    fetch('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    fetch(`http://localhost:5000/api/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    }).then(() => fetchUsers());
  };

  const handleDelete = (id) => {
    if(confirm('Are you sure you want to delete this user?')) {
      fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => fetchUsers());
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Manage Admins & Users</h1>
      <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{u.id}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{u.name}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{u.email}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                  <span style={{
                    padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '999px',
                    ...(u.role === 'admin' ? { backgroundColor: '#f3e8ff', color: '#6b21a8' } : { backgroundColor: '#f3f4f6', color: '#1f2937' })
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', display: 'flex', gap: '16px' }}>
                   <button onClick={() => handleRoleToggle(u.id, u.role)} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                     Toggle Role
                   </button>
                   <button onClick={() => handleDelete(u.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                     Delete
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
