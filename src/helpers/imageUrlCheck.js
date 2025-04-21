async function isImageValid(url) {
    try {
      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD to only get headers, not the full content
      });
      
      // Check if the status code is in the range of 200-299
      return response.ok; // This checks for 2xx responses
    } catch (error) {
      console.error('Error checking image URL:', error);
      return false; // If there's an error (like network issues), treat it as invalid
    }
  }

  export default isImageValid;