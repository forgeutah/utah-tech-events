package config

import (
	"fmt"
	"os"
	"strconv"
)

// DBConfig represents the database configuration
type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
}

// ServerConfig represents the server configuration
type ServerConfig struct {
	Port int
}

// Config represents the application configuration
type Config struct {
	DB     DBConfig
	Server ServerConfig
}

// Load loads the configuration from environment variables
func Load() (Config, error) {
	var cfg Config

	// Database configuration
	cfg.DB.Host = getEnv("DB_HOST", "localhost")
	
	dbPort, err := strconv.Atoi(getEnv("DB_PORT", "5432"))
	if err != nil {
		return cfg, fmt.Errorf("invalid DB_PORT: %w", err)
	}
	cfg.DB.Port = dbPort
	
	cfg.DB.User = getEnv("DB_USER", "postgres")
	cfg.DB.Password = getEnv("DB_PASSWORD", "postgres")
	cfg.DB.Name = getEnv("DB_NAME", "events")

	// Server configuration
	serverPort, err := strconv.Atoi(getEnv("SERVER_PORT", "8080"))
	if err != nil {
		return cfg, fmt.Errorf("invalid SERVER_PORT: %w", err)
	}
	cfg.Server.Port = serverPort

	return cfg, nil
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
