import { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';

function AdminProducts() {
  const { refreshProducts } = useContext(ProductContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '' });

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token || localStorage.getItem('token') || '';

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setProducts(data);
        } else if (data.rows) {
          setProducts(data.rows);
        } else {
          setProducts(data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/api/products/${editingId}` : 'http://localhost:5000/api/products';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...formData, price: Number(formData.price) })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to save product');
        }
        return res.json();
      })
      .then(() => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', price: '', description: '', image: '' });
        fetchProducts();
        refreshProducts(); // also update home page
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      image: product.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if(confirm('Are you sure you want to delete this product?')) {
      fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to delete product (It may be part of an order)');
        }
        return res.json();
      })
      .then(() => {
        fetchProducts();
        refreshProducts(); // also update home page
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Manage Products</h1>
        <button 
          onClick={() => {
            setEditingId(null); 
            setFormData({ name: '', price: '', description: '', image: '' });
            setShowForm(!showForm);
          }}
          style={{ backgroundColor: '#111827', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product Description" rows="3" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}></textarea>
            <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '12px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
             {editingId ? 'Update Product' : 'Save Product'}
            </button>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Image</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Price</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 24px' }}>
                     <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{p.name}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>${p.price}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button onClick={() => handleEdit(p)} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
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

export default AdminProducts;
