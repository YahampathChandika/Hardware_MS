// lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Helper function to format price
export function formatPrice(price) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(price);
}

// Helper function to generate unique filename for image uploads
export function generateFileName(originalFileName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFileName.split(".").pop();
  return `${timestamp}_${randomString}.${extension}`;
}

// Helper function to extract filename from URL
export function getFileNameFromUrl(url) {
  return url.split("/").pop();
}

// Helper function to validate image file
export function validateImageFile(file) {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload JPEG, JPG, PNG, or WebP images."
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      "File size too large. Please upload images smaller than 5MB."
    );
  }

  return true;
}
