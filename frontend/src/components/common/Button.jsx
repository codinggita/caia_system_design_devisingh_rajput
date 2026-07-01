import { motion } from 'framer-motion';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    ghost: 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5',
    danger: 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20',
    success: 'bg-success/10 text-success hover:bg-success/20 border border-success/20',
  };

  return (
    <motion.button
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      type={type}
      className={`relative inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : children}
    </motion.button>
  );
}
