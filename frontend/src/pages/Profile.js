import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_URL = "https://saree-store-api.onrender.com/api";

const Profile = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAddress(user.address || {
        street: '', city: '', state: '', pincode: '', phone: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Updating profile with:', { name, email, address });
      
      const res = await axios.put(
        `${API_URL}/auth/profile`,
        { name, email, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Response:', res.data);
      
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        // Update local user data
        logout(); // Logout to refresh
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Update failed. Please try again.');
    }
    setLoading(false);
  };

  const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
    title: { color: '#9b2c1d', marginBottom: '1.5rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' },
    button: { padding: '0.8rem', background: '#9b2c1d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
    section: { marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Profile</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={styles.input} 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={styles.input} 
        />
        
        <div style={styles.section}>
          <h3>Shipping Address</h3>
        </div>
        
        <input 
          type="text" 
          placeholder="Street Address" 
          value={address.street} 
          onChange={(e) => setAddress({...address, street: e.target.value})} 
          style={styles.input} 
        />
        <input 
          type="text" 
          placeholder="City" 
          value={address.city} 
          onChange={(e) => setAddress({...address, city: e.target.value})} 
          style={styles.input} 
        />
        <input 
          type="text" 
          placeholder="State" 
          value={address.state} 
          onChange={(e) => setAddress({...address, state: e.target.value})} 
          style={styles.input} 
        />
        <input 
          type="text" 
          placeholder="Pincode" 
          value={address.pincode} 
          onChange={(e) => setAddress({...address, pincode: e.target.value})} 
          style={styles.input} 
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          value={address.phone} 
          onChange={(e) => setAddress({...address, phone: e.target.value})} 
          style={styles.input} 
        />
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;