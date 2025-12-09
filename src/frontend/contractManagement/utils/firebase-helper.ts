/**
 * Mock Firebase helper for PDF operations.
 * In a real implementation, this would handle uploading PDF pages as images to Firebase Storage.
 */

export const uploadPdfPageAsImage = async (
  pdfBytes: Uint8Array,
  pageIndex: number
): Promise<string> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return a mock URL for the page image
  // Using a placeholder service to generate an image with the page number
  return `https://dummyimage.com/600x800/cccccc/000000&text=Page+${pageIndex + 1}`;
};

/**
 * Uploads a base64 image to Firebase (Mock)
 */
export const uploadImageToFirebase = async (
  base64Image: string,
  path: string
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return `https://mock-firebase-storage.com/${path}`;
};
