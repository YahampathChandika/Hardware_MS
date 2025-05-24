// app/page.js
"use client";

import { useState, useEffect } from "react";
import { Search, Grid, List, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/product-card";
import ProductList from "@/components/product-list";
import { supabaseOperations } from "@/lib/supabase";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load data
  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  // Apply filters and search
  useEffect(() => {
    loadData();
  }, [selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await supabaseOperations.getProducts(
        selectedCategory === "all" ? null : selectedCategory,
        searchTerm,
        "name", // Default sort by name
        "asc" // Default ascending order
      );
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await supabaseOperations.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "all";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Products
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Browse our complete hardware collection
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              View:
            </span>
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 lg:h-9 lg:w-9"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 lg:h-9 lg:w-9"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="space-y-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Search Bar */}
          <div className="relative lg:w-1/2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-11 text-base"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1">
              {/* Category Filter */}
              <div className="w-full sm:w-auto sm:min-w-[200px]">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div
            className={`grid gap-4 lg:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className={`bg-muted rounded-lg mb-4 ${
                    viewMode === "grid" ? "h-48 lg:h-64" : "h-32 lg:h-40"
                  }`}
                ></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <div className="mx-auto max-w-md">
              <Filter className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg lg:text-xl font-medium mb-2">
                No products found
              </h3>
              <p className="text-sm lg:text-base text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no products available at the moment."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {products.map((product) => (
              <ProductList key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && products.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm lg:text-base text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <Filter className="h-4 w-4" />
              <span>
                Showing {products.length} product
                {products.length !== 1 ? "s" : ""}
                {hasActiveFilters && " matching your criteria"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
