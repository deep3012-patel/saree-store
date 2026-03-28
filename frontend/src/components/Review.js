import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Review = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://saree-store-api.onrender.com/api/sarees/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('✨ Review added successfully!');
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded();
      }
    } catch (error) {
      console.error('Review error:', error);
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
    setSubmitting(false);
  };

  const styles = {
    container: {
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #eee',
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    select: {
      padding: '0.5rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '120px',
      fontSize: '1rem',
    },
    textarea: {
      padding: '0.8rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      minHeight: '80px',
      fontSize: '1rem',
      fontFamily: 'inherit',
    },
    button: {
      padding: '0.6rem 1.2rem',
      backgroundColor: '#9b2c1d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      width: 'fit-content',
    },
    buttonDisabled: {
      padding: '0.6rem 1.2rem',
      backgroundColor: '#ccc',
      color: '#666',
      border: 'none',
      borderRadius: '4px',
      cursor: 'not-allowed',
      width: 'fit-content',
    },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>✍️ Write a Review</h4>
      <form onSubmit={handleSubmit} style={styles.form}>
        <select 
          value={rating} 
          onChange={(e) => setRating(e.target.value)} 
          style={styles.select}
        >
          <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
          <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
          <option value={3}>⭐⭐⭐ 3 - Good</option>
          <option value={2}>⭐⭐ 2 - Fair</option>
          <option value={1}>⭐ 1 - Poor</option>
        </select>
        <textarea
          placeholder="Share your experience with this saree..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          style={styles.textarea}
        />
        <button 
          type="submit" 
          disabled={submitting} 
          style={submitting ? styles.buttonDisabled : styles.button}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default Review;