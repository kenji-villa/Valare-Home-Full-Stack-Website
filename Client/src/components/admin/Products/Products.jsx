import { useState, useEffect } from "react";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import DeleteModal from "./DeleteModal";
import { getProducts, deleteProduct } from "../../../services/productService";

export default function Products({ darkMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const categories = [
    "All",
    "Living Room",
    "Bedroom",
    "Dining",
    "Chairs",
    "Storage",
    "Office",
    "Outdoor",
    "Accessories",
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ limit: 100 });
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) {
      showNotification("No product selected for deletion", "error");
      return;
    }

    try {
      console.log(`Deleting product with ID: ${productToDelete}`);
      const response = await deleteProduct(productToDelete);

      if (response && response.success) {
        // Remove product from state
        setProducts(
          products.filter((p) => (p._id || p.id) !== productToDelete),
        );
        showNotification("Product deleted successfully!", "success");
      } else {
        throw new Error(response?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showNotification(`Failed to delete product: ${error.message}`, "error");
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleSaveProduct = async (savedProduct) => {
    try {
      if (editingProduct) {
        // Update existing product
        setProducts(
          products.map((p) => (p._id === savedProduct._id ? savedProduct : p)),
        );
        showNotification("Product updated successfully!", "success");
      } else {
        // Add new product - refresh the list to get the correct _id from server
        showNotification("Product added successfully!", "success");
        await fetchProducts(); // Refresh the entire list
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      showNotification("Failed to save product", "error");
    }
  };

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white animate-slide-in`}
        >
          {notification.message}
        </div>
      )}

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
        onAddProduct={handleAddProduct}
        darkMode={darkMode}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          darkMode={darkMode}
        />
      )}

      {showModal && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setShowModal(false)}
          categories={categories}
          darkMode={darkMode}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
