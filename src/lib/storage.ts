/**
 * Convert file to Base64 string
 * @param file - File object to convert
 * @returns Base64 encoded string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file as Base64
 * Simple frontend-only alternative
 */
export async function uploadDoctorImage(
  file: File,
  path: string
): Promise<string> {
  try {
    // Convert file to Base64
    const base64 = await fileToBase64(file);

    // Validate file size (max 5MB)
    if (base64.length > 5242880) {
      throw new Error("File too large (max 5MB)");
    }

    return base64;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Delete an image (Base64 stored in DB - just return null)
 */
export async function deleteDoctorImage(path: string): Promise<void> {
  // Not needed for Base64 approach - image is stored in DB
  return;
}
