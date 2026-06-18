const toastStyles = {
  success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg',
  error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
};

const Toast = ({ message, type }) => {
  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl px-5 py-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 ${toastStyles[type] || toastStyles.success}`}>
      <span className="text-lg font-bold flex-shrink-0 mt-0.5">{icons[type]}</span>
      <p className="text-sm font-medium leading-relaxed">{message}</p>
    </div>
  );
};

export default Toast;
