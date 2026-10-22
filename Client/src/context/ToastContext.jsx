import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, X, Info } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-slide-in ${
              toast.type === "success"
                ? "bg-white border-green-200 text-green-700"
                : toast.type === "error"
                  ? "bg-white border-red-200 text-red-700"
                  : "bg-white border-blue-200 text-blue-700"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {toast.type === "error" && (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-blue-500" />
            )}

            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
