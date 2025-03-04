import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Event, EventFilter } from '../types/event';
import { EventCard } from './EventCard';
import { FilterSidebar } from './FilterSidebar';

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<EventFilter>({
    pageSize: 10,
  });
  const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const loadEvents = async (newFilter?: EventFilter) => {
    try {
      setLoading(true);
      setError(null);

      const filterToUse = newFilter || filter;
      const response = await fetchEvents(filterToUse);

      // If it's a new filter, replace events, otherwise append
      const updatedEvents = newFilter ? response.events : [...events, ...response.events];

      setEvents(updatedEvents);
      setNextCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilter: EventFilter) => {
    const updatedFilter = {
      ...newFilter,
      pageSize: 10,
      cursor: undefined, // Reset cursor when filter changes
    };

    setFilter(updatedFilter);
    loadEvents(updatedFilter);
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      const loadMoreFilter = {
        ...filter,
        cursor: nextCursor,
      };

      setFilter(loadMoreFilter);
      loadEvents(loadMoreFilter);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">Utah Tech Events</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <FilterSidebar filter={filter} onFilterChange={handleFilterChange} />
        </div>

        <div className="md:w-3/4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!events?.length && !loading ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-700">No events found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}

              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}

          {loading && events.length === 0 && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
