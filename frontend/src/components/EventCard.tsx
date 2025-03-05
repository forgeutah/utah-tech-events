import { format, parseISO } from 'date-fns';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Format the date and time using date-fns
  const eventDate = parseISO(event.dateTime);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <div className="text-sm opacity-90">{event.group}</div>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <p className="text-gray-700">{event.description}</p>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center text-gray-600 mb-1">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-1">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-1">
          {event.tags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <a 
          href={event.eventLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          View Event Details
        </a>
      </div>
    </div>
  );
}
