package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/forgeutah/utah-tech-events/backend/internal/db"
	"github.com/forgeutah/utah-tech-events/backend/internal/models"
)

// Handler represents the API handler
type Handler struct {
	db *db.DB
}

// New creates a new API handler
func New(db *db.DB) *Handler {
	return &Handler{db: db}
}

// GetEvents handles the GET /events endpoint
func (h *Handler) GetEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse query parameters
	query := r.URL.Query()
	
	// Get group filter
	group := query.Get("group")
	
	// Get tags filter
	var tags []string
	if tagsParam := query.Get("tags"); tagsParam != "" {
		tags = strings.Split(tagsParam, ",")
	}
	
	// Get cursor for pagination
	var cursor *models.CursorInfo
	if cursorIDParam := query.Get("cursorId"); cursorIDParam != "" && query.Get("cursorDateTime") != "" {
		cursorID, err := strconv.Atoi(cursorIDParam)
		if err != nil {
			http.Error(w, "Invalid cursorId parameter", http.StatusBadRequest)
			return
		}
		
		cursorDateTime, err := time.Parse(time.RFC3339, query.Get("cursorDateTime"))
		if err != nil {
			http.Error(w, "Invalid cursorDateTime parameter", http.StatusBadRequest)
			return
		}
		
		cursor = &models.CursorInfo{
			ID:       cursorID,
			DateTime: cursorDateTime,
		}
	}
	
	// Get page size
	pageSize := 10 // Default page size
	if pageSizeParam := query.Get("pageSize"); pageSizeParam != "" {
		var err error
		pageSize, err = strconv.Atoi(pageSizeParam)
		if err != nil {
			http.Error(w, "Invalid pageSize parameter", http.StatusBadRequest)
			return
		}
		
		// Limit page size to a reasonable value
		if pageSize <= 0 {
			pageSize = 10
		} else if pageSize > 100 {
			pageSize = 100
		}
	}
	
	// Create filter
	filter := models.EventFilter{
		Group:    group,
		Tags:     tags,
		Cursor:   cursor,
		PageSize: pageSize,
	}
	
	// Get events from database
	events, nextCursor, hasMore, err := h.db.GetEvents(r.Context(), filter)
	if err != nil {
		http.Error(w, "Failed to get events: "+err.Error(), http.StatusInternalServerError)
		return
	}
	
	// Create response
	response := models.EventsResponse{
		Events:     events,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}
	
	// Write response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

// RegisterRoutes registers the API routes
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/events", h.GetEvents)
}

// EnableCORS adds CORS headers to the response
func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		// Call the next handler
		next.ServeHTTP(w, r)
	})
}
