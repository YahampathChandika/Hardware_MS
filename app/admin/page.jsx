// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Package, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductForm from "@/components/admin/product-form";
import CategoryForm from "@/components/admin/category-form";
import ProductTable from "@/components/admin/product-table";
import CategoryTable from "@/components/admin/category-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabaseOperations } from "@/lib/supabase";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Delete confirmation states
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'product' or 'category'

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        supabaseOperations.getProducts(),
        supabaseOperations.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Product operations
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setDeleteTarget(product);
    setDeleteType("product");
    setDeleteAlertOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;

    try {
      // Delete associated images first
      if (deleteTarget.images && deleteTarget.images.length > 0) {
        for (const imageUrl of deleteTarget.images) {
          const fileName = imageUrl.split("/").pop();
          await supabaseOperations.deleteImage(fileName);
        }
      }

      await supabaseOperations.deleteProduct(deleteTarget.id);
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
  };

  const handleProductSaved = () => {
    setProductModalOpen(false);
    setEditingProduct(null);
    loadData();
  };

  // Category operations
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    const productCount = products.filter(
      (p) => p.category_id === category.id
    ).length;

    if (productCount > 0) {
      // Show error for categories with products
      setDeleteTarget({ ...category, productCount });
      setDeleteType("category-error");
      setDeleteAlertOpen(true);
      return;
    }

    setDeleteTarget(category);
    setDeleteType("category");
    setDeleteAlertOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;

    try {
      await supabaseOperations.deleteCategory(deleteTarget.id);
      loadData();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category. Please try again.");
    }
  };

  const handleCategorySaved = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
    loadData();
  };

  // Get alert dialog content based on delete type
  const getAlertContent = () => {
    if (!deleteTarget || !deleteType) return {};

    switch (deleteType) {
      case "product":
        return {
          title: "Delete Product",
          description: `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone and will also delete all associated images.`,
          actionText: "Delete Product",
          onAction: confirmDeleteProduct,
          variant: "destructive",
        };

      case "category":
        return {
          title: "Delete Category",
          description: `Are you sure you want to delete the category "${deleteTarget.name}"? This action cannot be undone.`,
          actionText: "Delete Category",
          onAction: confirmDeleteCategory,
          variant: "destructive",
        };

      case "category-error":
        return {
          title: "Cannot Delete Category",
          description: `Cannot delete category "${
            deleteTarget.name
          }" because it has ${deleteTarget.productCount} product${
            deleteTarget.productCount !== 1 ? "s" : ""
          } assigned to it. Please remove all products from this category first.`,
          actionText: "Understood",
          onAction: () => {}, // Just close
          variant: "default",
          showCancel: false,
        };

      default:
        return {};
    }
  };

  const alertContent = getAlertContent();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your hardware products and categories
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR{" "}
              {products.length > 0
                ? (
                    products.reduce((sum, p) => sum + parseFloat(p.price), 0) /
                    products.length
                  ).toFixed(2)
                : "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Images</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.images && p.images.length > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Products Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your hardware products</CardDescription>
              </div>
              <Button onClick={handleAddProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable
              products={products}
              categories={categories}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </CardContent>
        </Card>

        {/* Categories Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage product categories</CardDescription>
              </div>
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryTable
              categories={categories}
              products={products}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          </CardContent>
        </Card>
      </div>

      {/* Product Modal */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSave={handleProductSaved}
            onCancel={() => setProductModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            onSave={handleCategorySaved}
            onCancel={() => setCategoryModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertContent.showCancel !== false && (
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={alertContent.onAction}
              className={
                alertContent.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {alertContent.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
