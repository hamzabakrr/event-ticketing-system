export const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000';

export const validateImageUrl = (url) => {
  if (!url) return DEFAULT_EVENT_IMAGE;
  
  try {
    new URL(url);
    return url;
  } catch {
    return DEFAULT_EVENT_IMAGE;
  }
};

export const getEventImage = (imageUrl) => {
  return validateImageUrl(imageUrl);
}; 