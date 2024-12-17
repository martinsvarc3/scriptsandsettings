import { SavedScript, Category } from '@/types';

interface ScriptUpdateParams {
  name?: string;
  content?: string;
  isSelected?: boolean;
  isPrimary?: boolean;
  memberstackId?: string;
  category?: Category;
}

export const scriptService = {
  async getScripts(teamId: string, memberstackId: string, category?: Category): Promise<SavedScript[]> {
    const params = new URLSearchParams({
      memberstackId,
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
    teamId: string,
    memberstackId: string,
    name: string,
    content: string,
    category: Category,
    isPrimary: boolean = false
  ): Promise<SavedScript> {
    const response = await fetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberstackId,
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
    teamId: string,
    updates: ScriptUpdateParams
  ): Promise<SavedScript> {
    const response = await fetch('/api/scripts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        ...updates
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update script');
    }
    return response.json();
  },

  async deleteScript(id: string, teamId: string): Promise<{ success: boolean }> {
    const params = new URLSearchParams({ 
      id,
      memberstackId: teamId // Using teamId as memberstackId for backward compatibility
    });
    const response = await fetch(`/api/scripts?${params}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete script');
    }
    return response.json();
  },

  async setPrimaryScript(
    id: string,
    teamId: string,
    category: Category,
    isPrimary: boolean
  ): Promise<SavedScript> {
    return this.updateScript(id, teamId, {
      category,
      isPrimary
    });
  }
};
