// components/admin/product-table.jsx
"use client";

import { useState } from "react";
import { Pencil, Trash2, Image as ImageIcon, Package } from "lucide-react";
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
import { formatPrice } from "@/lib/utils";

export default function ProductTable({
  products,
  categories,
  onEdit,
  onDelete,
}) {
  const [imagePreview, setImagePreview] = useState(null);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const handleImagePreview = (imageUrl) => {
    setImagePreview(imageUrl);
  };

  const closeImagePreview = () => {
    setImagePreview(null);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No products yet</h3>
        <p className="text-muted-foreground">
          Add your first product to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImagePreview(product.images[0])}
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Added {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {getCategoryName(product.category_id)}
                  </Badge>
                </TableCell>

                <TableCell className="font-medium">
                  {formatPrice(product.price)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {product.images ? product.images.length : 0}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={imagePreview}
              alt="Product preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={closeImagePreview}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
