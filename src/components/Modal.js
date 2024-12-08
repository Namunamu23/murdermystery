// src/components/Modal.js

import React from "react";
import { XIcon } from "@heroicons/react/solid";
import "../styles/Modal.css";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <XIcon className="modal-close-icon" />
        </button>
        <h3 className="modal-title">{title}</h3>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
