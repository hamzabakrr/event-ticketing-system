export const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000';
export const FALLBACK_EVENT_IMAGE = 'https://via.placeholder.com/800x400?text=Event+Image';

const TIMEOUT_MS = 5000; // 5 second timeout for image checks

export const validateImageUrl = async (url) => {
  if (!url) return DEFAULT_EVENT_IMAGE;
  
  try {
    // Clean and validate URL
    const cleanUrl = url.trim();
    if (!cleanUrl) return DEFAULT_EVENT_IMAGE;

    // Handle special characters in URL
    const encodedUrl = encodeURI(cleanUrl);
    const validUrl = new URL(encodedUrl);
    
    // Check if URL is already encoded
    const decodedUrl = decodeURIComponent(encodedUrl);
    if (decodedUrl !== cleanUrl) {
      return validateImageUrl(decodedUrl);
    }

    // Test if image loads with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(validUrl.href, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Image load failed for ${url}, using fallback`);
        return FALLBACK_EVENT_IMAGE;
      }

      // Verify content type is an image
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        console.warn(`Invalid content type for ${url}, using fallback`);
        return FALLBACK_EVENT_IMAGE;
      }

      return validUrl.href;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn(`Image load timeout for ${url}, using fallback`);
      } else {
        console.warn(`Image load failed for ${url}, using fallback:`, error);
      }
      return FALLBACK_EVENT_IMAGE;
    }
  } catch (error) {
    console.warn(`Invalid image URL: ${url}, using fallback`, error);
    return FALLBACK_EVENT_IMAGE;
  }
};

export const getEventImage = async (imageUrl) => {
  try {
    return await validateImageUrl(imageUrl);
  } catch (error) {
    console.error('Error loading image:', error);
    return FALLBACK_EVENT_IMAGE;
  }
}; 