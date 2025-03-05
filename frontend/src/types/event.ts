export interface Event {
  id: number;
  title: string;
  description: string;
  group: string;
  tags: string[];
  dateTime: string;
  location: string;
  eventLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  nextCursor?: number;
  hasMore: boolean;
}

export interface EventFilter {
  group?: string;
  tags?: string[];
  cursor?: number;
  pageSize?: number;
}
