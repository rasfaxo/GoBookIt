import React from 'react';

type AllowedTags = 'div' | 'section' | 'article' | 'aside';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: AllowedTags;
  hover?: boolean;
  padding?: string;
  children: React.ReactNode;
}

const Card = ({
  as: Tag = 'div',
  hover = false,
  padding = 'p-6',
  className = '',
  children,
  ...rest
}: CardProps) => {
  const merged = `bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl shadow-md ${padding} transition-shadow ${
    hover ? 'hover:shadow-lg' : ''
  } ${className}`.trim();
  return (
    <Tag className={merged} {...(rest as any)}>
      {children}
    </Tag>
  );
};

export default Card;
