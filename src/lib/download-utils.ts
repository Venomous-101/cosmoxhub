/**
 * Simple, clean download utility - no ads, no paywalls, no deception.
 * Just triggers a native browser download.
 */

export async function triggerDownload(blob: Blob, filename: string): Promise<void> {
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body (required for Firefox)
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  } finally {
    // Revoke the URL after a short delay to ensure download is started
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}

export async function triggerDownloadFromFile(file: File): Promise<void> {
  await triggerDownload(file, file.name);
}
