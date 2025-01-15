import React from 'react'

const Center = ({ children, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full h-[90vh] ${className}`}>
      {children}
    </div>
  );
};

export default Center
