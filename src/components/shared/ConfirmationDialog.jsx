// src/components/shared/ConfirmationDialog.jsx
import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <div className="modal">
    <p>{message}</p>
    <button onClick={onConfirm}>Yes</button>
    <button onClick={onCancel}>No</button>
  </div>
);

export default ConfirmationDialog;
