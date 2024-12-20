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
    // Include memberId in both URL and body
    const params = new URLSearchParams({ memberId });
    
    console.log('Creating script with data:', { 
      memberId, 
      name, 
      contentLength: content?.length,
      category 
    });

    const response = await fetch(`/api/scripts?${params}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId,
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
    // Include memberId in both URL and body
    const params = new URLSearchParams({ memberId });

    const response = await fetch(`/api/scripts?${params}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        memberId,
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
    const params = new URLSearchParams({ id, memberId });

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
