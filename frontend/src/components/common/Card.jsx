import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'p-6',
  onClick,
  ...props
}) {
  const baseClasses = `glass-card ${padding} ${className}`;
  
  if (hoverable || onClick) {
    return (
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClick}
        className={`${baseClasses} cursor-pointer hover:border-primary/30 premium-shadow group`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {children}
    </div>
  );
}
