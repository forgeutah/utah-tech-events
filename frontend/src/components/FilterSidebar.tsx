import { useEffect, useState } from 'react';
import { fetchGroups, fetchTags } from '../services/api';
import { EventFilter } from '../types/event';

interface FilterSidebarProps {
  filter?: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
}

export function FilterSidebar({ filter = {}, onFilterChange }: FilterSidebarProps) {
  const [groups, setGroups] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(filter.tags || []);

  useEffect(() => {
    async function loadFilters() {
      try {
        setLoading(true);
        const [groupsData, tagsData] = await Promise.all([fetchGroups(), fetchTags()]);

        setGroups(groupsData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFilters();
  }, []);

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = { ...filter, group: e.target.value || undefined };
    onFilterChange(newFilter);
  };

  const handleTagToggle = (tag: string) => {
    let newSelectedTags;

    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter(t => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }

    setSelectedTags(newSelectedTags);
    const newFilter = { ...filter, tags: newSelectedTags.length > 0 ? newSelectedTags : undefined };
    onFilterChange(newFilter);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    onFilterChange({ pageSize: filter.pageSize });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter Events</h2>

      {loading ? (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="group-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <select
              id="group-filter"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filter.group || ''}
              onChange={handleGroupChange}
            >
              <option value="">All Groups</option>
              {groups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </>
      )}
    </div>
  );
}
