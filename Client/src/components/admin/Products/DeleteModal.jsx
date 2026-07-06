import { AlertCircle } from "lucide-react";

export default function DeleteModal({ onConfirm, onCancel, darkMode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg max-w-md w-full p-6`}
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3
            className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-2`}
          >
            Delete Product
          </h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
