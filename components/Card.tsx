
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, icon, className = "" }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <span className="p-2 bg-orange-50 rounded-lg text-orange-600">
            {icon}
          </span>
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
