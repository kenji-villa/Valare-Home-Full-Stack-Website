import { useState, useEffect } from "react";
import { X, Save, Plus, GripVertical, Upload } from "lucide-react";
import {
  uploadProductImages,
  createProduct,
  updateProduct,
} from "../../../services/productService";

export default function ProductForm({
  product,
  onSave,
  onClose,
  categories,
  darkMode,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "0",
    stock: "",
    category: "",
    subcategory: "",
    color: "",
    material: "",
    sku: "",
    availability: "In Stock",
    images: [],
    specifications: {
      material: "",
      color: "",
      style: "",
      assembly: "",
      weightCapacity: "",
      warranty: "",
    },
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        discount: product.discount?.toString() || "0",
        stock: product.stock.toString(),
        category: product.category || "",
        subcategory: product.subcategory || "",
        color: product.color || "",
        material: product.material || "",
        sku: product.sku || "",
        availability: product.availability || "In Stock",
        images: product.images || [],
        specifications: {
          material: product.specifications?.material || "",
          color: product.specifications?.color || "",
          style: product.specifications?.style || "",
          assembly: product.specifications?.assembly || "",
          weightCapacity: product.specifications?.weightCapacity || "",
          warranty: product.specifications?.warranty || "",
        },
      });
      setImagePreviews(product.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert(
        "Some files were invalid. Please use JPG, PNG, GIF, or WEBP under 5MB.",
      );
      return;
    }

    const newFiles = [...imageFiles, ...validFiles];
    if (newFiles.length > 4) {
      alert("Maximum 4 images allowed.");
      return;
    }

    // Show previews immediately
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setImageFiles(newFiles);

    // Upload images to server
    try {
      setUploading(true);
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("images", file);
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:3001/api/products/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      if (data.success) {
        const uploadedPaths = data.images.map((img) => img.path);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedPaths],
        }));
        console.log("Images uploaded successfully:", uploadedPaths);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.");
      // Remove previews if upload failed
      setImagePreviews((prev) => prev.slice(0, -validFiles.length));
      setImageFiles((prev) => prev.slice(0, -validFiles.length));
    } finally {
      setUploading(false);
    }
  };

  // Replace the handleSubmit function:
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.stock
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate subcategory is selected
    if (!formData.subcategory) {
      alert("Please select a subcategory.");
      return;
    }

    // Validate images
    if (formData.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    // Prepare product data
    const productData = {
      name: formData.name,
      description: formData.description || "",
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : null,
      discount: formData.discount ? parseInt(formData.discount) : 0,
      stock: parseInt(formData.stock),
      category: formData.category,
      subcategory: formData.subcategory,
      color: formData.color || "",
      material: formData.material || "",
      sku: formData.sku || undefined,
      images: formData.images,
      coverImage: formData.images[0],
      specifications: {
        material: formData.specifications.material || formData.material || "",
        color: formData.specifications.color || formData.color || "",
        style: formData.specifications.style || "",
        assembly: formData.specifications.assembly || "",
        weightCapacity: formData.specifications.weightCapacity || "",
        warranty: formData.specifications.warranty || "",
      },
    };

    try {
      setUploading(true);
      let savedProduct;

      if (product) {
        // Update existing product
        const response = await fetch(
          `http://localhost:3001/api/products/${product._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(productData),
          },
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Update failed");
        savedProduct = data.product;
        onSave(savedProduct);
      } else {
        // Create new product
        const response = await fetch("http://localhost:3001/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(productData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Create failed");
        savedProduct = data.product;
        onSave(savedProduct);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert(
        `Failed to ${product ? "update" : "create"} product: ${error.message}`,
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newPaths = formData.images.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setFormData((prev) => ({ ...prev, images: newPaths }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <h2
            className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Basic Info */}
            <div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="Enter product name"
                />
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="Enter product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Category, Images, etc. */}
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="">Select category</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="">Select subcategory</option>
                    {/* Home Subcategories */}
                    {formData.category === "Home" && (
                      <>
                        <option value="Living Room">Living Room</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Dining">Dining</option>
                        <option value="Kids">Kids</option>
                      </>
                    )}
                    {/* Office Subcategories */}
                    {formData.category === "Office" && (
                      <>
                        <option value="Chairs">Chairs</option>
                        <option value="Storage">Storage</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Accessories">Accessories</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="e.g., Fabric, Wood"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    placeholder="Auto-generated if left blank"
                  />
                </div>
              </div>

              {/* Images Upload */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Product Images (2-4 images, max 5MB each)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 border rounded-lg overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 4 && (
                    <label
                      className={`w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#DA4C2F] transition-colors ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                        disabled={uploading}
                      />
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {imagePreviews.length}/4 images
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div
            className={`mt-4 p-4 border rounded-lg ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <h4
              className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"} mb-3 flex items-center gap-2`}
            >
              <GripVertical className="w-4 h-4 text-[#DA4C2F]" />
              Technical Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Material
                </label>
                <input
                  type="text"
                  name="specifications.material"
                  value={formData.specifications.material}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="e.g., Premium fabric, solid wood frame"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Color Options
                </label>
                <input
                  type="text"
                  name="specifications.color"
                  value={formData.specifications.color}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="e.g., Brown, Gray, Black"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Style
                </label>
                <input
                  type="text"
                  name="specifications.style"
                  value={formData.specifications.style}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="e.g., Modern, Contemporary"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Assembly Required
                </label>
                <input
                  type="text"
                  name="specifications.assembly"
                  value={formData.specifications.assembly}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="e.g., Required (tools included)"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Weight Capacity
                </label>
                <input
                  type="text"
                  name="specifications.weightCapacity"
                  value={formData.specifications.weightCapacity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="e.g., 600 lbs"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                >
                  Warranty
                </label>
                <input
                  type="text"
                  name="specifications.warranty"
                  value={formData.specifications.warranty}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="e.g., 2 years limited"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="bg-[#DA4C2F] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#c43d22] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {uploading
                ? "Uploading..."
                : product
                  ? "Update Product"
                  : "Save Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
