# Utah Tech Events API

A simple REST API for fetching a list of tech events in Utah.

## Features

- Get a list of tech events with filtering by group and tags
- Cursor-based pagination for efficient "Load More" functionality
- PostgreSQL database for data storage

## Requirements

- Go 1.18 or higher
- PostgreSQL 14 or higher
- Docker and Docker Compose (optional)

## Running the Application

### Using Docker Compose

The easiest way to run the application is using Docker Compose:

```bash
docker-compose up -d
```

This will start the application and PostgreSQL database in Docker containers.

### Manual Setup

1. Set up a PostgreSQL database:

```bash
# Create a new database
createdb events
```

2. Set environment variables:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=events
export SERVER_PORT=8080
```

3. Build and run the application:

```bash
go build -o server ./cmd/server
./server
```

## API Endpoints

### GET /events

Get a list of tech events with optional filtering.

#### Query Parameters

- `group`: Filter events by group name
- `tags`: Filter events by tags (comma-separated)
- `cursor`: Cursor for pagination
- `pageSize`: Number of events to return (default: 10, max: 100)

#### Response

```json
{
  "events": [
    {
      "id": 1,
      "title": "Go Meetup",
      "description": "Monthly meetup for Go developers",
      "group": "Golang Users Group",
      "tags": ["golang", "programming"],
      "dateTime": "2023-04-15T18:00:00Z",
      "location": "Salt Lake City, UT",
      "eventLink": "https://example.com/event",
      "createdAt": "2023-04-01T12:00:00Z",
      "updatedAt": "2023-04-01T12:00:00Z"
    }
  ],
  "nextCursor": 1,
  "hasMore": true
}
```

## Development

### Project Structure

- `cmd/server`: Main application entry point
- `internal/api`: API handlers
- `internal/config`: Configuration management
- `internal/db`: Database access layer
- `internal/models`: Data models

### Adding Test Data

You can add test data to the database using SQL:

```sql
INSERT INTO events (title, description, group_name, tags, date_time, location, event_link, created_at, updated_at)
VALUES 
  ('Go Meetup', 'Monthly meetup for Go developers', 'Golang Users Group', 
   ARRAY['golang', 'programming'], '2023-04-15T18:00:00Z', 'Salt Lake City, UT', 
   'https://example.com/event', NOW(), NOW()),
  ('AI Conference', 'Annual AI conference', 'Utah AI Group', 
   ARRAY['ai', 'machine-learning', 'conferences'], '2023-05-20T09:00:00Z', 'Provo, UT', 
   'https://example.com/ai-conf', NOW(), NOW());
```
