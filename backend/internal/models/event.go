package models

import (
	"time"
)

// Event represents a tech event
type Event struct {
	ID          int       `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Group       string    `json:"group" db:"group_name"`
	Tags        []string  `json:"tags" db:"tags"`
	DateTime    time.Time `json:"dateTime" db:"date_time"`
	Location    string    `json:"location" db:"location"`
	EventLink   string    `json:"eventLink" db:"event_link"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updated_at"`
}

// CursorInfo represents the cursor information for pagination
type CursorInfo struct {
	ID       int       `json:"id"`
	DateTime time.Time `json:"dateTime"`
}

// EventFilter represents the filter parameters for events
type EventFilter struct {
	Group    string   `json:"group"`
	Tags     []string `json:"tags"`
	Cursor   *CursorInfo `json:"cursor,omitempty"`
	PageSize int      `json:"pageSize"`
}

// EventsResponse represents the response for the events endpoint
type EventsResponse struct {
	Events     []Event     `json:"events"`
	NextCursor *CursorInfo `json:"nextCursor,omitempty"`
	HasMore    bool        `json:"hasMore"`
}
