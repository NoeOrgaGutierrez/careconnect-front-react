import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  imageUrl: string;
  isOpen: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ imageUrl, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <img src={imageUrl} alt="Loading..." className="loading-image" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
