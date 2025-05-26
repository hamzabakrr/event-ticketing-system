<<<<<<< HEAD
// Default image from a reliable CDN
export const DEFAULT_EVENT_IMAGE = 'https://placehold.co/800x400/e2e8f0/1e293b?text=Event+Image';
=======
export const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000';
>>>>>>> origin/main

export const validateImageUrl = (url) => {
  if (!url) return DEFAULT_EVENT_IMAGE;
  
  try {
<<<<<<< HEAD
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
=======
    new URL(url);
    return url;
  } catch {
>>>>>>> origin/main
    return DEFAULT_EVENT_IMAGE;
  }
};

export const getEventImage = (imageUrl) => {
<<<<<<< HEAD
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
=======
  return validateImageUrl(imageUrl);
>>>>>>> origin/main
}; 