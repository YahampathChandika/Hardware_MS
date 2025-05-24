// components/admin/category-table.jsx
"use client";

import {
  Pencil,
  Trash2,
  Tag,
  MoreVertical,
  Calendar,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CategoryTable({
  categories,
  products,
  onEdit,
  onDelete,
}) {
  const getProductCount = (categoryId) => {
    return products.filter((product) => product.category_id === categoryId)
      .length;
  };

  const canDeleteCategory = (categoryId) => {
    return getProductCount(categoryId) === 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Tag className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-medium mb-2">
          No categories yet
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          Add your first category to organize products
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {categories.map((category) => {
          const productCount = getProductCount(category.id);
          const canDelete = canDeleteCategory(category.id);

          return (
            <Card key={category.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Category Header */}
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="h-4 w-4 text-primary flex-shrink-0" />
                      <h4 className="font-semibold text-base truncate">
                        {category.name}
                      </h4>
                    </div>

                    {/* Category Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <Badge
                          variant={productCount > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {productCount} product{productCount !== 1 ? "s" : ""}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(category.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(category)}
                        className="flex items-center space-x-2"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Edit Category</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(category)}
                        disabled={!canDelete}
                        className={`flex items-center space-x-2 ${
                          canDelete
                            ? "text-destructive focus:text-destructive"
                            : ""
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>
                          {canDelete
                            ? "Delete Category"
                            : `Cannot delete (${productCount} products)`}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Category Name</TableHead>
              <TableHead className="w-[20%]">Products</TableHead>
              <TableHead className="w-[25%]">Created</TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const productCount = getProductCount(category.id);
              const canDelete = canDeleteCategory(category.id);

              return (
                <TableRow key={category.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={productCount > 0 ? "default" : "secondary"}>
                      {productCount} product{productCount !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(category.created_at)}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(category)}
                        className="h-8 w-8 p-0"
                        title="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(category)}
                        disabled={!canDelete}
                        className={`h-8 w-8 p-0 ${
                          canDelete
                            ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                            : ""
                        }`}
                        title={
                          !canDelete
                            ? `Cannot delete: ${productCount} products use this category`
                            : "Delete category"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Info Footer */}
      <div className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground border rounded-lg bg-muted/30">
        <div className="flex items-start space-x-2">
          <span className="text-base">💡</span>
          <div className="space-y-1">
            <p className="font-medium">Category Management Tips:</p>
            <ul className="space-y-0.5 ml-2">
              <li>• Categories with products cannot be deleted</li>
              <li>• Remove all products from a category before deleting</li>
              <li>• Use descriptive names for better organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
