// components/product-list.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Calendar, Images, Tag, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatPrice } from "@/lib/utils";

export default function ProductList({ product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const images = product.images || [];
  const hasImages = images.length > 0;

  const handleCardClick = (e) => {
    // Check if the click came from carousel navigation buttons
    if (e.target.closest(".carousel-button")) {
      return;
    }
    setModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get first two images for display
  const getDisplayImages = () => {
    if (!hasImages) return [];
    if (images.length === 1) return [images[0]];
    return [images[0], images[1]];
  };

  const displayImages = getDisplayImages();

  return (
    <>
      <Card
        className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary cursor-pointer hover:scale-[1.01]"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Enhanced Image Section */}
            <div className="relative w-full h-48 sm:w-48 sm:h-40 md:w-1/3 md:h-48 lg:w-56 lg:h-52 flex-shrink-0">
              {hasImages ? (
                <div className="w-full h-48">
                  <Carousel className="w-full h-full">
                    <CarouselContent className="h-48 -ml-0">
                      {images.map((imageUrl, index) => (
                        <CarouselItem key={index} className="h-full  pl-0">
                          <div className="relative w-full h-full">
                            <Image
                              src={imageUrl}
                              alt={`${product.name} - Image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              priority={index === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="carousel-button absolute left-2 sm:left-1 !size-6 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm z-10" />
                        <CarouselNext className="carousel-button absolute right-2 sm:right-1 !size-6 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm z-10" />
                      </>
                    )}
                  </Carousel>

                  {/* Image counter */}
                  {images.length > 1 && (
                    <Badge className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs sm:text-sm z-20">
                      {images.length} images
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg">
                  <Package className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-1 sm:mb-2" />
                  <span className="text-xs text-muted-foreground text-center">
                    No Image
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Product Info */}
            <div className="flex-1 p-4 sm:p-6 min-w-0">
              <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <h3 className="font-bold text-lg sm:text-xl mb-2 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Badge
                        variant="secondary"
                        className="flex items-center space-x-1 text-xs"
                      >
                        <Tag className="h-2 w-2 sm:h-3 sm:w-3" />
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {product.categories?.name || "Uncategorized"}
                        </span>
                      </Badge>

                      {hasImages && (
                        <Badge
                          variant="outline"
                          className="flex items-center space-x-1 text-xs"
                        >
                          <Images className="h-2 w-2 sm:h-3 sm:w-3" />
                          <span>
                            {images.length} image
                            {images.length !== 1 ? "s" : ""}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="text-left sm:text-right sm:ml-4 flex-shrink-0">
                    <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Price per unit
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 gap-2 sm:gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        Added {formatDate(product.created_at)}
                      </span>
                    </div>

                    {product.updated_at !== product.created_at && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          Updated {formatDate(product.updated_at)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Click hint */}
                  <div className="pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="hidden sm:inline">
                        Click anywhere to view details
                      </span>
                      <span className="sm:hidden">Tap to view details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Modal with Carousel */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 mx-2 sm:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Image Section */}
            <div className="relative bg-muted order-1 lg:order-1 flex items-center justify-center">
              {hasImages ? (
                <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]">
                  <Carousel className="w-full h-full">
                    <CarouselContent className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] -ml-0">
                      {images.map((imageUrl, index) => (
                        <CarouselItem key={index} className="h-full pl-0">
                          <div className="relative w-full h-full">
                            <Image
                              src={imageUrl}
                              alt={`${product.name} - Image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              priority={index === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm z-10" />
                        <CarouselNext className="absolute right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm z-10" />
                      </>
                    )}
                  </Carousel>

                  {/* Image counter */}
                  {images.length > 1 && (
                    <Badge className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs sm:text-sm z-20">
                      {images.length} images
                    </Badge>
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
