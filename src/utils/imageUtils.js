// Default image from a reliable CDN
export const DEFAULT_EVENT_IMAGE = 'https://placehold.co/800x400/e2e8f0/1e293b?text=Event+Image';

export const validateImageUrl = (url) => {
  if (!url) return DEFAULT_EVENT_IMAGE;
  
  try {
    const parsedUrl = new URL(url);
    // Check if the URL is using HTTPS or is a relative path
    if (parsedUrl.protocol === 'https:' || url.startsWith('/')) {
      // For relative paths, prepend the API base URL
      if (url.startsWith('/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${url}`;
      }
      return url;
    }
    // Convert HTTP to HTTPS if possible
    if (parsedUrl.protocol === 'http:') {
      return url.replace('http:', 'https:');
    }
    return DEFAULT_EVENT_IMAGE;
  } catch {
    // If URL parsing fails, check if it's a relative path
    if (url.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${url}`;
    }
    return DEFAULT_EVENT_IMAGE;
  }
};

export const getEventImage = (imageUrl) => {
  const validatedUrl = validateImageUrl(imageUrl);
  
  // Return a function that can be used as an error handler
  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_EVENT_IMAGE) {
      e.target.src = DEFAULT_EVENT_IMAGE;
    }
  };
  
  return {
    src: validatedUrl,
    onError: handleImageError
  };
}; 