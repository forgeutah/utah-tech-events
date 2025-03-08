import { EventFilter, EventsResponse } from '../types/event';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} ${errorText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchEvents(filter: EventFilter = {}): Promise<EventsResponse> {
  const queryParams = new URLSearchParams();

  if (filter.group) {
    queryParams.append('group', filter.group);
  }

  if (filter.tags && filter.tags.length > 0) {
    queryParams.append('tags', filter.tags.join(','));
  }

  if (filter.cursor) {
    queryParams.append('cursorId', filter.cursor.id.toString());
    queryParams.append('cursorDateTime', filter.cursor.dateTime);
  }

  if (filter.pageSize) {
    queryParams.append('pageSize', filter.pageSize.toString());
  }

  try {
    const url = `${API_BASE_URL}/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<EventsResponse>(response);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function fetchGroups(): Promise<string[]> {
  // In a real application, you might have an endpoint to fetch all unique groups
  // For now, we'll fetch all events and extract unique groups
  try {
    const { events } = await fetchEvents({ pageSize: 100 });
    const uniqueGroups = [...new Set(events.map(event => event.group))];
    return uniqueGroups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
}

export async function fetchTags(): Promise<string[]> {
  // In a real application, you might have an endpoint to fetch all unique tags
  // For now, we'll fetch all events and extract unique tags
  try {
    const { events } = await fetchEvents({ pageSize: 100 });
    const allTags = events.flatMap(event => event.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}
