import { motion } from 'framer-motion';

export default function Input({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  touched,
  className = '',
  required = false,
  disabled = false,
  ...props
}) {
  const isError = error && touched;

  return (
    <div className={`w-full group ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 ml-1 group-focus-within:text-primary-light transition-colors">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white text-sm transition-all duration-300 outline-none placeholder:text-text-muted/50 ${
            isError 
              ? 'border-danger/50 focus:border-danger' 
              : 'border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...props}
        />
        {isError && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold text-danger mt-1.5 ml-1 uppercase tracking-wider"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
