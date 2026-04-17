# Polyglot Data Export Engine

## Project Overview

A high-performance streaming data export system capable of exporting **10 million PostgreSQL records** into multiple formats (CSV, JSON, XML, Parquet) with optional gzip compression and performance benchmarking.

The **Polyglot Data Export Engine** is a high-performance backend service designed to stream extremely large datasets from PostgreSQL into multiple data formats efficiently.

The system supports exporting **10 million rows** while maintaining **constant low memory usage** through streaming techniques. This ensures the application does not load the entire dataset into memory, making it suitable for large-scale data pipelines and reporting systems.

The engine supports multiple export formats to serve different consumers:

- **CSV** – for spreadsheet and business analytics tools
- **JSON** – for APIs and web applications
- **XML** – for legacy enterprise systems
- **Parquet** – for analytics platforms and data warehouses

The system also supports **optional gzip compression** to reduce network transfer size for text-based formats.

---

# Architecture

The application follows a modular backend architecture:


Client Request
│
▼
REST API (Express.js)
│
▼
Export Service
│
▼
Streaming Engine
│
▼
PostgreSQL Database


### Key Components

**API Layer**
- Handles incoming requests
- Validates export parameters
- Generates export job IDs

**Streaming Engine**
- Streams data row-by-row from PostgreSQL
- Prevents large memory consumption
- Supports multiple serialization formats

**Database**
- PostgreSQL container seeded with **10 million records**

---

# Technologies Used

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Docker**
- **Docker Compose**
- **pg-copy-streams**
- **ParquetJS**
- **zlib (gzip compression)**

---

# Setup Instructions

## Prerequisites

Install the following tools:

- Docker
- Docker Compose
- Node.js (optional for local testing)

---

## Run the Project

Clone the repository and run:

```bash
docker-compose up --build
``` 
# This command will:

Start PostgreSQL container

Seed the database with 10 million records

Start the API server

Expose the service on port 8080

# Server will be available at:

http://localhost:8080
## Database Schema

# The system creates the following table:

Column	Type
id	BIGSERIAL
created_at	TIMESTAMP
name	VARCHAR
value	DECIMAL
metadata	JSONB

The database is automatically seeded with 10,000,000 records.

## Example API Usage

### Create Export Job

POST /exports

Request Body:

{
  "format": "csv",
  "compression": "gzip"
}

Response:

{
  "exportId": "9df330e3-a475-48c4-aa7a-2699f3ea42b5",
  "status": "pending"
}

---

### Download Export

GET /exports/{exportId}/download

Example:

GET /exports/9df330e3-a475-48c4-aa7a-2699f3ea42b5/download

This will stream the exported dataset.

---

### Run Benchmark

GET /exports/benchmark

Example Response:

{
  "datasetRowCount": 10000000,
  "results": [
    {
      "format": "csv",
      "durationSeconds": 20,
      "fileSizeBytes": 118000000,
      "peakMemoryMB": 120
    }
  ]
}

# The system supports gzip compression for text-based formats:

CSV

JSON

XML

## Example request:

{
 "format":"csv",
 "compression":"gzip"
}
### Performance Benchmark

# The benchmark endpoint measures:

Export duration

Output file size

Peak memory usage

This demonstrates the efficiency of the streaming architecture.

## Key Features

Streams 10 million rows

Constant memory usage

Multi-format export

Gzip compression support

Dockerized deployment

Performance benchmarking

### Project Structure
polyglot-data-export-engine
│
├── docker-compose.yml
├── Dockerfile
├── README.md
├── .env.example
│
├── source_code
│   ├── app.js
│   ├── routes.js
│   ├── exportService.js
│   └── streaming
│
├── seeds
│   └── init-db.sh
│
└── tests
### Conclusion

The Polyglot Data Export Engine demonstrates how large-scale datasets can be exported efficiently using streaming techniques. By combining Docker-based deployment, scalable data streaming, and support for multiple formats, the system provides a flexible solution for modern data-driven applications.