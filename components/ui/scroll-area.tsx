import React from 'react';

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ className, children }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      {children}
    </div>
  );
};

export const ScrollBar: React.FC<{ orientation: 'horizontal' | 'vertical' }> = ({ orientation }) => {
  return (
    <div className={`scrollbar-${orientation}`}>
      {/* Aquí puedes agregar el estilo del scrollbar si es necesario */}
    </div>
  );
};

export default ScrollArea;