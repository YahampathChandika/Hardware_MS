// components/product-list.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Images,
  Tag,
  Eye,
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

export default function ProductList({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const images = product.images || [];
  const hasImages = images.length > 0;

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasImages && images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasImages && images.length > 1) {
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

  // Get current and next image for 2-image display
  const getCurrentImages = () => {
    if (!hasImages) return [];
    if (images.length === 1) return [images[0]];

    const current = images[currentImageIndex];
    const next = images[(currentImageIndex + 1) % images.length];
    return [current, next];
  };

  const currentImages = getCurrentImages();

  return (
    <>
      <Card
        className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary cursor-pointer hover:scale-[1.01]"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="flex">
            {/* Enhanced Image Section - 2 Images Side by Side */}
            <div className="relative w-48 h-40 md:w-1/3 md:h-48 flex-shrink-0">
              {hasImages ? (
                <div className="relative h-full">
                  {/* Image Container */}
                  <div className="flex h-full space-x-1">
                    {currentImages.map((imageUrl, index) => (
                      <div
                        key={`${currentImageIndex}-${index}`}
                        className={`relative ${
                          currentImages.length === 1 ? "w-full" : "w-1/2"
                        } h-full`}
                      >
                        <Image
                          src={imageUrl}
                          alt={`${product.name} - Image ${
                            currentImageIndex + index + 1
                          }`}
                          fill
                          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                            index === 0
                              ? currentImages.length === 1
                                ? "rounded-l-lg"
                                : "rounded-tl-lg rounded-bl-lg"
                              : "rounded-tr-lg rounded-br-lg"
                          }`}
                          sizes="(max-width: 768px) 120px, 140px"
                        />
                      </div>
                    ))}
                  </div>

                  {/* View Details Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 rounded-l-lg">
                    <Button
                      size="sm"
                      className="bg-background/90 text-foreground hover:bg-background border backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  {/* Enhanced Navigation - Only show if more than 2 images OR more than 1 image for single display */}
                  {images.length > (currentImages.length === 1 ? 1 : 2) && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background z-20"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background z-20"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Enhanced Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1 text-xs bg-black/70 text-white px-3 py-1 rounded-full backdrop-blur-sm z-10">
                      <Images className="h-3 w-3" />
                      <span>
                        {currentImages.length === 1
                          ? `${currentImageIndex + 1}/${images.length}`
                          : `${currentImageIndex + 1}-${Math.min(
                              currentImageIndex + 2,
                              images.length
                            )}/${images.length}`}
                      </span>
                    </div>
                  )}

                  {/* Hover indicator dots for navigation */}
                  {images.length > 2 && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <div className="flex space-x-1">
                        {Array.from({
                          length: Math.ceil(images.length / 2),
                        }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              Math.floor(currentImageIndex / 2) === i
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 rounded-l-lg">
                  <Package className="h-12 w-12 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    No Image
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Product Info */}
            <div className="flex-1 p-6 min-w-0">
              <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
                      {product.name}
                    </h3>

                    <div className="flex items-center space-x-3 mb-3">
                      <Badge
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <Tag className="h-3 w-3" />
                        <span>
                          {product.categories?.name || "Uncategorized"}
                        </span>
                      </Badge>

                      {hasImages && (
                        <Badge
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          <Images className="h-3 w-3" />
                          <span>
                            {images.length} image
                            {images.length !== 1 ? "s" : ""}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Price per unit
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Added {formatDate(product.created_at)}</span>
                    </div>

                    {product.updated_at !== product.created_at && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {formatDate(product.updated_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* Click hint */}
                  <div className="pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click anywhere to view details
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
          <div className="grid md:grid-cols-2 h-full">
            {/* Image Section */}
            <div className="relative bg-muted">
              {hasImages ? (
                <div className="relative h-[400px] md:h-[600px]">
                  <Image
                    src={images[modalImageIndex]}
                    alt={`${product.name} - Image ${modalImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Image Navigation in Modal */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 backdrop-blur-sm"
                        onClick={prevModalImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 backdrop-blur-sm"
                        onClick={nextModalImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>

                      {/* Image counter */}
                      <Badge className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white">
                        {modalImageIndex + 1} of {images.length}
                      </Badge>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-[400px] md:h-[600px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Package className="h-20 w-20 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No Images Available</p>
                  </div>
                </div>
              )}

              {/* Thumbnail strip */}
              {hasImages && images.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {images.map((imageUrl, index) => (
                      <button
                        key={index}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
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
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {product.categories?.name || "Uncategorized"}
                    </Badge>
                    <DialogTitle className="text-2xl font-bold leading-tight">
                      {product.name}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              {/* Price Section */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="text-3xl font-bold text-primary mb-1">
                  {formatPrice(product.price)}
                </div>
                <p className="text-sm text-muted-foreground">Price per unit</p>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Product Information</h4>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Product ID</p>
                    <p className="font-mono text-xs">{product.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Category</p>
                    <p>{product.categories?.name || "Uncategorized"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Date Added</p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(product.created_at)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Images</p>
                    <p className="flex items-center">
                      <Images className="h-4 w-4 mr-1" />
                      {hasImages
                        ? `${images.length} image${
                            images.length !== 1 ? "s" : ""
                          }`
                        : "No images"}
                    </p>
                  </div>
                </div>

                {product.updated_at !== product.created_at && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Last updated: {formatDate(product.updated_at)}
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
