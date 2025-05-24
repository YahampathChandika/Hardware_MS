// components/product-card.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
  Calendar,
  Images,
  Tag,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const images = product.images || [];
  const hasImages = images.length > 0;

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const nextModalImage = () => {
    if (hasImages) {
      setModalImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevModalImage = () => {
    if (hasImages) {
      setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleCardClick = () => {
    setModalImageIndex(currentImageIndex);
    setModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Card
        className="group border transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md bg-gradient-to-b from-background to-background/95"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Enhanced Image Section */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-muted via-muted/80 to-muted/60">
            {hasImages ? (
              <>
                <Image
                  src={images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View Details Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    size="sm"
                    className="bg-background/90 text-foreground hover:bg-background border backdrop-blur-sm text-xs sm:text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick();
                    }}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                </div>

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 sm:h-8 sm:w-8 bg-background/80 backdrop-blur-sm hover:bg-background z-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 sm:h-8 sm:w-8 bg-background/80 backdrop-blur-sm hover:bg-background z-10"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    {/* Image Counter Badge */}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 text-white border-0 backdrop-blur-sm text-xs"
                    >
                      <Images className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      {currentImageIndex + 1}/{images.length}
                    </Badge>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? "bg-white scale-125"
                              : "bg-white/60 hover:bg-white/80"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Single image indicator */}
                {images.length === 1 && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 text-white border-0 backdrop-blur-sm text-xs"
                  >
                    <Images className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />1
                  </Badge>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Package className="h-12 w-12 sm:h-16 sm:w-16 mb-2 sm:mb-3 opacity-50" />
                <span className="text-xs sm:text-sm font-medium text-center px-2">
                  No Image Available
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Product Info */}
          <div className="p-3 sm:p-4 lg:p-5 space-y-2 sm:space-y-3">
            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                <Tag className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {product.categories?.name || "Uncategorized"}
                </span>
              </Badge>
              {hasImages && images.length > 1 && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  +{images.length - 1} more
                </span>
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-bold text-sm sm:text-base lg:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-muted-foreground">per unit</p>
              </div>

              {/* Click hint */}
              <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
                Click to view
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 mx-2 sm:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Image Section */}
            <div className="relative bg-muted order-1 lg:order-1">
              {hasImages ? (
                <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]">
                  <Image
                    src={images[modalImageIndex]}
                    alt={`${product.name} - Image ${modalImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />

                  {/* Image Navigation in Modal */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm"
                        onClick={prevModalImage}
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm"
                        onClick={nextModalImage}
                      >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>

                      {/* Image counter */}
                      <Badge className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs sm:text-sm">
                        {modalImageIndex + 1} of {images.length}
                      </Badge>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Package className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 opacity-50" />
                    <p className="text-base sm:text-lg font-medium">
                      No Images Available
                    </p>
                  </div>
                </div>
              )}

              {/* Thumbnail strip */}
              {hasImages && images.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                  <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((imageUrl, index) => (
                      <button
                        key={index}
                        className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === modalImageIndex
                            ? "border-primary scale-110"
                            : "border-white/50 hover:border-white"
                        }`}
                        onClick={() => setModalImageIndex(index)}
                      >
                        <Image
                          src={imageUrl}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto order-2 lg:order-2 max-h-[400px] lg:max-h-none">
              <DialogHeader>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    <Tag className="h-3 w-3 mr-1" />
                    {product.categories?.name || "Uncategorized"}
                  </Badge>
                  <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight pr-8">
                    {product.name}
                  </DialogTitle>
                </div>
              </DialogHeader>

              {/* Price Section */}
              <div className="bg-primary/5 rounded-lg p-3 sm:p-4 border border-primary/20">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {formatPrice(product.price)}
                </div>
                <p className="text-sm text-muted-foreground">Price per unit</p>
              </div>

              {/* Product Information */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-base sm:text-lg">
                  Product Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Product ID</p>
                    <p className="font-mono text-xs break-all">{product.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Category</p>
                    <p className="break-words">
                      {product.categories?.name || "Uncategorized"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Date Added</p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="break-words">
                        {formatDate(product.created_at)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Images</p>
                    <p className="flex items-center">
                      <Images className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>
                        {hasImages
                          ? `${images.length} image${
                              images.length !== 1 ? "s" : ""
                            }`
                          : "No images"}
                      </span>
                    </p>
                  </div>
                </div>

                {product.updated_at !== product.created_at && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="break-words">
                        Last updated: {formatDate(product.updated_at)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
