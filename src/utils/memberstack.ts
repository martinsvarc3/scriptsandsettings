declare global {
  interface Window {
    $memberstackDom: {
      getCurrentMember: () => Promise<{
        data: {
          id: string;
          customFields: {
            tid: string;
          };
          metaData: Record<string, any>;
        };
      }>;
    };
  }
}

export async function getMemberData() {
  try {
    const memberstack = window.$memberstackDom;
    if (!memberstack) {
      throw new Error('Memberstack not initialized');
    }

    const { data: member } = await memberstack.getCurrentMember();
    if (!member) {
      throw new Error('No member found');
    }

    return {
      memberstackId: member.id,
      teamId: member.customFields.tid
    };
  } catch (error) {
    console.error('Error getting member data:', error);
    throw error;
  }
}
