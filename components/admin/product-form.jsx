// components/admin/product-form.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  X,
  Loader2,
  Package,
  AlertCircle,
  Image as ImageIcon,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabaseOperations } from "@/lib/supabase";
import {
  generateFileName,
  validateImageFile,
  getFileNameFromUrl,
  formatPrice,
} from "@/lib/utils";

export default function ProductForm({ product, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category_id: product.category_id || "",
        price: product.price || "",
        images: product.images || [],
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Product name must be less than 100 characters";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    } else if (parseFloat(formData.price) > 1000000) {
      newErrors.price = "Price must be less than 1,000,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding these images would exceed limit
    if (formData.images.length + files.length > 10) {
      alert(
        `You can only upload up to 10 images total. You currently have ${formData.images.length} images.`
      );
      return;
    }

    setUploadingImages(true);
    const newImages = [];
    const failedUploads = [];

    try {
      for (const file of files) {
        try {
          validateImageFile(file);
          const fileName = generateFileName(file.name);
          const imageUrl = await supabaseOperations.uploadImage(file, fileName);
          newImages.push(imageUrl);
        } catch (error) {
          failedUploads.push({ file: file.name, error: error.message });
        }
      }

      if (newImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }

      if (failedUploads.length > 0) {
        const errorMessage = failedUploads
          .map((f) => `${f.file}: ${f.error}`)
          .join("\n");
        alert(`Some images failed to upload:\n${errorMessage}`);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploadingImages(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleRemoveImage = async (imageUrl, index) => {
    try {
      // Delete from storage
      const fileName = getFileNameFromUrl(imageUrl);
      await supabaseOperations.deleteImage(fileName);

      // Remove from form data
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        category_id: formData.category_id,
        price: parseFloat(formData.price),
        images: formData.images,
      };

      if (product) {
        await supabaseOperations.updateProduct(product.id, productData);
      } else {
        await supabaseOperations.addProduct(productData);
      }

      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === formData.category_id
  );
  const hasPrice = formData.price && parseFloat(formData.price) > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              {product ? "Edit Product" : "New Product"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {product
              ? "Update product details below"
              : "Fill in the details for the new product"}
          </p>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Product Name
          </Label>
          <div className="relative">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name"
              className={`h-11 ${
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }`}
              maxLength={100}
              disabled={loading}
            />
            <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
              {formData.name.length}/100
            </div>
          </div>
          {errors.name && (
            <div className="flex items-start space-x-2 text-red-500">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errors.name}</p>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => handleInputChange("category_id", value)}
            disabled={loading}
          >
            <SelectTrigger
              className={`h-11 ${
                errors.category_id ? "border-red-500 focus:border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <div className="flex items-start space-x-2 text-red-500">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errors.category_id}</p>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            Price (LKR)
          </Label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              max="1000000"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
              className={`h-11 ${
                errors.price ? "border-red-500 focus:border-red-500" : ""
              }`}
              disabled={loading}
            />
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.price && (
            <div className="flex items-start space-x-2 text-red-500">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errors.price}</p>
            </div>
          )}
          {hasPrice && !errors.price && (
            <div className="text-sm text-muted-foreground">
              Preview:{" "}
              <span className="font-medium text-foreground">
                {formatPrice(parseFloat(formData.price))}
              </span>
            </div>
          )}
        </div>

        {/* Product Preview */}
        {(formData.name.trim() || selectedCategory || hasPrice) && (
          <div className="p-3 sm:p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Product Preview</span>
            </div>
            <div className="space-y-1 text-sm">
              {formData.name.trim() && (
                <p>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {formData.name.trim()}
                </p>
              )}
              {selectedCategory && (
                <p>
                  <span className="text-muted-foreground">Category:</span>{" "}
                  {selectedCategory.name}
                </p>
              )}
              {hasPrice && (
                <p>
                  <span className="text-muted-foreground">Price:</span>{" "}
                  {formatPrice(parseFloat(formData.price))}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Product Images</Label>
            <Badge variant="outline" className="text-xs">
              {formData.images.length}/10 images
            </Badge>
          </div>

          {/* Upload Button */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              type="button"
              variant="outline"
              disabled={
                uploadingImages || loading || formData.images.length >= 10
              }
              onClick={() => document.getElementById("image-upload").click()}
              className="w-full sm:w-auto"
            >
              {uploadingImages ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {formData.images.length >= 10
                ? "Max images reached"
                : "Upload Images"}
            </Button>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="text-xs text-muted-foreground">
              <p>Max 5MB per image • JPG, PNG, WebP</p>
              <p>Up to 10 images total</p>
            </div>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Uploaded Images</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {formData.images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      onClick={() => handleRemoveImage(imageUrl, index)}
                      disabled={loading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || uploadingImages}
            className="w-full sm:w-auto order-1 sm:order-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {product ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                {product ? "Update Product" : "Add Product"}
              </>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>• All fields are required except images</p>
          <p>• Product names should be descriptive and unique</p>
          <p>• Images help customers identify products quickly</p>
          {product && (
            <p className="text-amber-600">
              • Existing product data will be updated
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
