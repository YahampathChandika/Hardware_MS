// components/admin/category-form.jsx
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
      } else {
        setError("Error saving category. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="categoryName">Category Name</Label>
        <Input
          id="categoryName"
          value={categoryName}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter category name (e.g., Tools, Hardware, Paint)"
          className={error ? "border-red-500" : ""}
          autoFocus
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !categoryName.trim()}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {category ? "Update Category" : "Add Category"}
        </Button>
      </div>
    </form>
  );
}
