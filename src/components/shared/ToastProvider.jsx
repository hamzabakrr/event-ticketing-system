// src/components/shared/ToastProvider.jsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = () => <ToastContainer position="top-right" autoClose={3000} />;

export default ToastProvider;
