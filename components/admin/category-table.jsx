// components/admin/category-table.jsx
"use client";

import { Pencil, Trash2, Tag } from "lucide-react";
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

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No categories yet</h3>
        <p className="text-muted-foreground">
          Add your first category to organize products
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const productCount = getProductCount(category.id);
            const canDelete = canDeleteCategory(category.id);

            return (
              <TableRow key={category.id}>
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
                  {new Date(category.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(category)}
                      disabled={!canDelete}
                      className={
                        canDelete
                          ? "text-destructive hover:text-destructive"
                          : ""
                      }
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

      {/* Info about deletion restrictions */}
      <div className="p-3 text-xs text-muted-foreground border-t bg-muted/50">
        💡 Categories with products cannot be deleted. Remove all products from
        a category first.
      </div>
    </div>
  );
}
