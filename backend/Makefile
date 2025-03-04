.PHONY: build run test clean docker-build docker-run seed

# Build the application
build:
	go build -o bin/server ./cmd/server

# Run the application
run: build
	./bin/server

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Build Docker image
docker-build:
	docker build -t utah-tech-events-api .

# Run with Docker Compose
docker-run:
	docker-compose up -d

# Seed the database with test data
seed:
	./scripts/seed.sh

# Stop Docker Compose services
docker-stop:
	docker compose down

# Show help
help:
	@echo "Available targets:"
	@echo "  build        - Build the application"
	@echo "  run          - Run the application"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run with Docker Compose"
	@echo "  docker-stop  - Stop Docker Compose services"
	@echo "  seed         - Seed the database with test data"
