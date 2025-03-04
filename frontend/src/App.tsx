import { useState } from 'react';
import { EventsList } from './components/EventsList';

function App() {
  const [showEvents, setShowEvents] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {!showEvents ? (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
              <h1 className="text-2xl font-bold text-center">Forge Utah - Tech Events Calendar</h1>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">A community calendar for tech events in Utah</p>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                onClick={() => setShowEvents(true)}
              >
                View Events
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <EventsList />
        </div>
      )}
    </div>
  );
}

export default App;
