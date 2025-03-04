package db

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/forgeutah/utah-tech-events/backend/internal/config"
	"github.com/forgeutah/utah-tech-events/backend/internal/models"
	"github.com/lib/pq"
	_ "github.com/lib/pq" // postgres driver
)

// DB represents the database connection
type DB struct {
	db *sql.DB
}

// New creates a new database connection
func New(cfg config.Config) (*DB, error) {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.DB.Host, cfg.DB.Port, cfg.DB.User, cfg.DB.Password, cfg.DB.Name)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Test the connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DB{db: db}, nil
}

// Close closes the database connection
func (d *DB) Close() error {
	return d.db.Close()
}

// GetEvents retrieves events based on the provided filter
func (d *DB) GetEvents(ctx context.Context, filter models.EventFilter) ([]models.Event, int, bool, error) {
	// Build the query
	query := `
		SELECT id, title, description, group_name, tags, date_time, location, event_link, created_at, updated_at
		FROM events
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 1

	// Add filter conditions
	if filter.Group != "" {
		query += fmt.Sprintf(" AND group_name = $%d", argCount)
		args = append(args, filter.Group)
		argCount++
	}

	if len(filter.Tags) > 0 {
		query += fmt.Sprintf(" AND tags && $%d", argCount)
		args = append(args, pq.Array(filter.Tags))
		argCount++
	}

	if filter.Cursor > 0 {
		query += fmt.Sprintf(" AND id < $%d", argCount)
		args = append(args, filter.Cursor)
		argCount++
	}

	// Add order by and limit
	query += " ORDER BY id DESC"
	if filter.PageSize > 0 {
		query += fmt.Sprintf(" LIMIT $%d", argCount)
		args = append(args, filter.PageSize+1) // Fetch one more to determine if there are more results
		argCount++
	}

	// Execute the query
	rows, err := d.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, false, fmt.Errorf("failed to query events: %w", err)
	}
	defer rows.Close()

	// Parse the results
	var events []models.Event
	for rows.Next() {
		var event models.Event
		var tagsArray pq.StringArray

		err := rows.Scan(
			&event.ID,
			&event.Title,
			&event.Description,
			&event.Group,
			&tagsArray,
			&event.DateTime,
			&event.Location,
			&event.EventLink,
			&event.CreatedAt,
			&event.UpdatedAt,
		)
		if err != nil {
			return nil, 0, false, fmt.Errorf("failed to scan event: %w", err)
		}

		event.Tags = []string(tagsArray)
		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, 0, false, fmt.Errorf("error iterating over rows: %w", err)
	}

	// Check if there are more results
	hasMore := false
	nextCursor := 0

	if filter.PageSize > 0 && len(events) > filter.PageSize {
		hasMore = true
		events = events[:filter.PageSize]
		nextCursor = events[len(events)-1].ID
	}

	return events, nextCursor, hasMore, nil
}

// SetupDB initializes the database schema
func (d *DB) SetupDB(ctx context.Context) error {
	// Create events table
	query := `
		CREATE TABLE IF NOT EXISTS events (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			group_name TEXT NOT NULL,
			tags TEXT[] NOT NULL,
			date_time TIMESTAMP WITH TIME ZONE NOT NULL,
			location TEXT NOT NULL,
			event_link TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
		);
	`
	_, err := d.db.ExecContext(ctx, query)
	if err != nil {
		return fmt.Errorf("failed to create events table: %w", err)
	}

	// Create indexes for efficient filtering
	indexes := []string{
		"CREATE INDEX IF NOT EXISTS idx_events_group_name ON events(group_name);",
		"CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags);",
		"CREATE INDEX IF NOT EXISTS idx_events_date_time ON events(date_time);",
	}

	for _, idx := range indexes {
		_, err := d.db.ExecContext(ctx, idx)
		if err != nil {
			return fmt.Errorf("failed to create index: %w", err)
		}
	}

	return nil
}

// InsertEvent adds a new event to the database
func (d *DB) InsertEvent(ctx context.Context, event models.Event) (int, error) {
	query := `
		INSERT INTO events (title, description, group_name, tags, date_time, location, event_link, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`

	var id int
	err := d.db.QueryRowContext(
		ctx,
		query,
		event.Title,
		event.Description,
		event.Group,
		pq.Array(event.Tags),
		event.DateTime,
		event.Location,
		event.EventLink,
		time.Now(),
		time.Now(),
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("failed to insert event: %w", err)
	}

	return id, nil
}
