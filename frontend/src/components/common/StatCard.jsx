import React from 'react';

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendDirection = 'neutral',
  color = 'primary',
  className = '',
}) {
  const getColors = () => {
    switch (color) {
      case 'secondary':
        return 'from-secondary/10 to-secondary/5 text-secondary border-secondary/20 shadow-secondary/5';
      case 'success':
        return 'from-success/10 to-success/5 text-success border-success/20 shadow-success/5';
      case 'primary':
      default:
        return 'from-primary/10 to-primary/5 text-primary-light border-primary/20 shadow-primary/5';
    }
  };

  return (
    <div className={`glass-card p-6 flex items-center justify-between group premium-shadow ${className}`}>
      <div className="flex items-center gap-5">
        {icon && (
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border bg-gradient-to-br transition-all duration-500 group-hover:scale-110 shadow-lg ${getColors()}`}>
            {React.cloneElement(icon, { className: 'text-2xl' })}
          </div>
        )}
        <div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white tracking-tighter leading-none">{value}</h3>
            {trend && (
              <span className={`text-[10px] font-bold ${trendDirection === 'up' ? 'text-success' : 'text-danger'}`}>
                {trendDirection === 'up' ? '+' : ''}{trend}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon && React.cloneElement(icon, { className: 'text-5xl rotate-12' })}
      </div>
    </div>
  );
}

