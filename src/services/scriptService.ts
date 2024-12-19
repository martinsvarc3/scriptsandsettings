import { SavedScript, Category } from '@/types';

interface ScriptUpdateParams {
  name?: string;
  content?: string;
  category?: Category;
}

export const scriptService = {
  async getScripts(memberId: string, category?: Category): Promise<SavedScript[]> {
    const params = new URLSearchParams({
      memberId,
      ...(category && { category })
    });
    
    const response = await fetch(`/api/scripts?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch scripts');
    }
    
    return response.json();
  },

  async createScript(
    memberId: string,
    name: string,
    content: string,
    category: Category
  ): Promise<SavedScript> {
    // Get the memberId from URL as fallback
    const urlParams = new URLSearchParams(window.location.search);
    const urlMemberId = urlParams.get('memberId');
    
    // Use provided memberId or fallback to URL memberId
    const finalMemberId = memberId || urlMemberId;
    
    if (!finalMemberId) {
      throw new Error('Member ID is required');
    }

    console.log('Creating script with data:', { 
      memberId: finalMemberId, 
      name, 
      contentLength: content?.length,
      category 
    });

    const response = await fetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: finalMemberId,
        name,
        content,
        category
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create script');
    }

    return response.json();
  },

  async updateScript(
    id: string,
    memberId: string,
    updates: ScriptUpdateParams
  ): Promise<SavedScript> {
    // Get the memberId from URL as fallback
    const urlParams = new URLSearchParams(window.location.search);
    const urlMemberId = urlParams.get('memberId');
    
    // Use provided memberId or fallback to URL memberId
    const finalMemberId = memberId || urlMemberId;
    
    if (!finalMemberId) {
      throw new Error('Member ID is required');
    }

    const response = await fetch('/api/scripts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        memberId: finalMemberId,
        ...updates
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update script');
    }

    return response.json();
  },

  async deleteScript(id: string, memberId: string): Promise<{ success: boolean }> {
    // Get the memberId from URL as fallback
    const urlParams = new URLSearchParams(window.location.search);
    const urlMemberId = urlParams.get('memberId');
    
    // Use provided memberId or fallback to URL memberId
    const finalMemberId = memberId || urlMemberId;
    
    if (!finalMemberId) {
      throw new Error('Member ID is required');
    }

    const params = new URLSearchParams({ 
      id, 
      memberId: finalMemberId 
    });

    const response = await fetch(`/api/scripts?${params}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete script');
    }

    return response.json();
  }
};
