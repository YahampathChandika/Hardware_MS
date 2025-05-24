// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Tag,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { formatPrice } from "@/lib/utils";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

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

  // Calculate statistics
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const averagePrice =
    totalProducts > 0
      ? products.reduce((sum, p) => sum + parseFloat(p.price), 0) /
        totalProducts
      : 0;
  const productsWithImages = products.filter(
    (p) => p.images && p.images.length > 0
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-muted rounded animate-pulse"
              ></div>
            ))}
          </div>

          <div className="h-12 bg-muted rounded animate-pulse"></div>
          <div className="h-96 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your hardware products and categories
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalProducts === 0 ? "No products yet" : "Active products"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalCategories === 0
                  ? "No categories yet"
                  : "Product categories"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {totalProducts > 0 ? formatPrice(averagePrice) : "LKR 0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalProducts > 0
                  ? "Average product price"
                  : "No products to calculate"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Images</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsWithImages}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalProducts > 0
                  ? `${Math.round(
                      (productsWithImages / totalProducts) * 100
                    )}% have images`
                  : "No products yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg sm:text-xl">
                    Management
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage your products and categories
                  </CardDescription>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {activeTab === "products" ? (
                    <Button
                      onClick={handleAddProduct}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddCategory}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs Navigation */}
              <TabsList className="grid w-full grid-cols-2 max-w-md !my-4">
                <TabsTrigger
                  value="products"
                  className="flex items-center space-x-2"
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                  <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                    {totalProducts}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="flex items-center space-x-2"
                >
                  <Tag className="h-4 w-4" />
                  <span>Categories</span>
                  <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                    {totalCategories}
                  </span>
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              {/* Products Tab */}
              <TabsContent value="products" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Product Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, and manage your hardware products
                    </p>
                  </div>
                </div>
                <ProductTable
                  products={products}
                  categories={categories}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Category Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Organize your products with categories
                    </p>
                  </div>
                </div>
                <CategoryTable
                  categories={categories}
                  products={products}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Product Modal */}
        <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
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
          <DialogContent className="max-w-[95vw] sm:max-w-md mx-2 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
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
          <AlertDialogContent className="max-w-[95vw] sm:max-w-lg mx-2 sm:mx-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">
                {alertContent.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                {alertContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {alertContent.showCancel !== false && (
                <AlertDialogCancel className="w-full sm:w-auto">
                  Cancel
                </AlertDialogCancel>
              )}
              <AlertDialogAction
                onClick={alertContent.onAction}
                className={`w-full sm:w-auto ${
                  alertContent.variant === "destructive"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : ""
                }`}
              >
                {alertContent.actionText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
