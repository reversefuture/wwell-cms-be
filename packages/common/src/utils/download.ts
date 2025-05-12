export const downloadByJson = (data: object, filename: string) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  link.remove();
};

export const downloadImg = (imgData: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = imgData;
  link.download = fileName;
  link.click();
  link.remove();
};

// Function to download the markdown content as a file
export const downloadMarkdown = (markdown: string, fileName: string) => {
  const link = document.createElement('a');
  const markdownFile = new Blob([markdown], { type: 'text/markdown' });
  link.href = URL.createObjectURL(markdownFile);
  link.download = fileName;
  link.click();
  link.remove();
};

export const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  link.remove();
};

export const downloadFileByBlob = async (url: string, fileName: string) => {
  try {
    // Fetch the file as a Blob
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    // Convert the response to a Blob in Memory
    const blob = await response.blob();
    // Create a Blob URL
    const blobUrl = URL.createObjectURL(blob);
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link); // Append to the document to ensure it works in all browsers
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl); // Release the Blob URL
  } catch (error: any) {
    console.error('Error downloading file:', error);
  }
};
