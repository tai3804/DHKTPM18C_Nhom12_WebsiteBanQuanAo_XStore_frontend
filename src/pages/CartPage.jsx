import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header/Header';

export default function CartPage() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div>
      <Header />
      <main className="p-4">
        {user ? (
          <>
            <h1 className="text-xl font-bold mb-4">Your Cart</h1>
            {/* Nội dung giỏ hàng */}
          </>
        ) : (
          <div className="text-center mt-10">
            <p className="mb-2">You must login to see your cart.</p>
            <button
              onClick={handleLoginClick}
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
