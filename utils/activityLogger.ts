// Utility function to log user activities
export async function logActivity(action: string, description: string, metadata?: any) {
  try {
    const response = await fetch('/api/admin/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        description,
        metadata,
      }),
    });

    if (!response.ok) {
      console.error('Failed to log activity:', response.status);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Common activity types
export const ActivityTypes = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPLOAD_METRIC: 'upload_metric',
  UPLOAD_DOCUMENT: 'upload_document',
  UPLOAD_IMAGE: 'upload_image',
  CREATE_OBSERVATION: 'create_observation',
  RESPOND_OBSERVATION: 'respond_observation',
} as const;
