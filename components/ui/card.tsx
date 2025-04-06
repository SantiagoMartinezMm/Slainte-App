import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ className, children, onClick }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export default Card;