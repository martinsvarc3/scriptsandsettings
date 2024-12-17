export async function getMemberData() {
  try {
    // Get ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const memberstackId = params.get('memberId');
    console.log('URL Parameters:', {
      memberstackId,
      fullUrl: window.location.href
    });
    
    if (!memberstackId) {
      console.error('Missing memberstack ID in URL:', window.location.search);
      throw new Error('Missing memberstack ID in URL');
    }
    
    return {
      memberstackId
    };
  } catch (error) {
    console.error('Error getting member data:', error);
    throw error;
  }
}
