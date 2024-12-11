import { SavedScript, Category } from '@/types';

export const scriptService = {
  async getScripts(teamId: string, memberstackId: string, category?: Category) {
    const params = new URLSearchParams({
      teamId,
      memberstackId,
      ...(category && { category })
    });
    
    const response = await fetch(`/api/scripts?${params}`);
    if (!response.ok) throw new Error('Failed to fetch scripts');
    return response.json();
  },

  async createScript(teamId: string, memberstackId: string, name: string, content: string, category: Category) {
    const response = await fetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamId,
        memberstackId,
        name,
        content,
        category
      })
    });
    if (!response.ok) throw new Error('Failed to create script');
    return response.json();
  },

  async updateScript(
    id: string,
    teamId: string,
    updates: Partial<{ name: string; content: string; isSelected: boolean }>
  ) {
    const response = await fetch('/api/scripts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        teamId,
        ...updates
      })
    });
    if (!response.ok) throw new Error('Failed to update script');
    return response.json();
  },

  async deleteScript(id: string, teamId: string) {
    const params = new URLSearchParams({ id, teamId });
    const response = await fetch(`/api/scripts?${params}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete script');
    return response.json();
  }
};
