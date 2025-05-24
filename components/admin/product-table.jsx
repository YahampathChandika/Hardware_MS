// components/admin/product-table.jsx
"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  Image as ImageIcon,
  Package,
  MoreVertical,
  Calendar,
  Tag,
  DollarSign,
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-medium mb-2">No products yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          Add your first product to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {products.map((product) => (
            <Card key={product.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImagePreview(product.images[0])}
                      />
                    ) : (
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Product Name */}
                        <h4 className="font-semibold text-base sm:text-lg truncate">
                          {product.name}
                        </h4>

                        {/* Category and Price */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            <span className="truncate max-w-[100px]">
                              {getCategoryName(product.category_id)}
                            </span>
                          </Badge>

                          <div className="flex items-center text-primary font-semibold">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="text-sm sm:text-base">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Added {formatDate(product.created_at)}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <ImageIcon className="h-3 w-3" />
                            <span>
                              {product.images ? product.images.length : 0} image
                              {product.images?.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 ml-2"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEdit(product)}
                            className="flex items-center space-x-2"
                          >
                            <Pencil className="h-4 w-4" />
                            <span>Edit Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="flex items-center space-x-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Product</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="min-w-[200px]">Product</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[120px]">Price</TableHead>
                <TableHead className="w-[100px]">Images</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="w-12 h-12 xl:w-16 xl:h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
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
                    <div className="space-y-1">
                      <div className="font-medium text-sm xl:text-base line-clamp-2">
                        {product.name}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Added {formatDate(product.created_at)}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[100px]">
                        {getCategoryName(product.category_id)}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-primary text-sm xl:text-base">
                      {formatPrice(product.price)}
                    </div>
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
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8 p-0"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete product"
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
      </div>

      {/* Enhanced Image Preview Modal */}
      {imagePreview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] sm:max-w-4xl">
            <img
              src={imagePreview}
              alt="Product preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 p-0"
              onClick={closeImagePreview}
            >
              ✕
            </Button>
            {/* Tap to close hint on mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full sm:hidden">
              Tap anywhere to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
