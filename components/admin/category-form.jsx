// components/admin/category-form.jsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseOperations } from "@/lib/supabase";

export default function CategoryForm({ category, onSave, onCancel }) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data
  useEffect(() => {
    if (category) {
      setCategoryName(category.name || "");
    }
  }, [category]);

  const handleInputChange = (value) => {
    setCategoryName(value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return false;
    }

    if (categoryName.trim().length < 2) {
      setError("Category name must be at least 2 characters");
      return false;
    }

    if (categoryName.trim().length > 50) {
      setError("Category name must be less than 50 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const trimmedName = categoryName.trim();

      if (category) {
        await supabaseOperations.updateCategory(category.id, trimmedName);
      } else {
        await supabaseOperations.addCategory(trimmedName);
      }

      onSave();
    } catch (error) {
      console.error("Error saving category:", error);

      // Handle specific error cases
      if (error.message && error.message.includes("duplicate")) {
        setError("A category with this name already exists");
      } else if (error.message && error.message.includes("unique")) {
        setError("A category with this name already exists");
      } else {
        setError("Error saving category. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
            <Tag className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              {category ? "Edit Category" : "New Category"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {category
              ? "Update the category name below"
              : "Enter a name for the new category"}
          </p>
        </div>

        {/* Category Name Input */}
        <div className="space-y-2">
          <Label htmlFor="categoryName" className="text-sm font-medium">
            Category Name
          </Label>
          <div className="relative">
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter category name (e.g., Tools, Hardware, Paint)"
              className={`h-11 ${
                error ? "border-red-500 focus:border-red-500" : ""
              }`}
              autoFocus
              maxLength={50}
              disabled={loading}
            />
            {/* Character counter */}
            <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
              {categoryName.length}/50
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start space-x-2 text-red-500">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success preview */}
          {categoryName.trim() && !error && (
            <div className="text-sm text-muted-foreground">
              Preview:{" "}
              <span className="font-medium text-foreground">
                {categoryName.trim()}
              </span>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
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
            disabled={loading || !categoryName.trim()}
            className="w-full sm:w-auto order-1 sm:order-2 min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {category ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <Tag className="h-4 w-4 mr-2" />
                {category ? "Update Category" : "Add Category"}
              </>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground text-center sm:text-left space-y-1">
          <p>• Category names must be unique</p>
          <p>• Use descriptive names for better organization</p>
          {category && (
            <p className="text-amber-600">
              • Products in this category will be updated
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
