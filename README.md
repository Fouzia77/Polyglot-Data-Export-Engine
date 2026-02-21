
# 📦 Polyglot Data Export Engine

A high-performance, Dockerized data export service built with **Node.js (Fastify)** and **PostgreSQL** that streams large datasets into multiple formats (CSV, JSON, XML, Parquet) with optional Gzip compression.

---

## 🚀 Features

* ⚡ Fast streaming exports (memory efficient)
* 🐳 Fully Dockerized setup
* 🗄 PostgreSQL backend
* 📄 Multiple export formats:

  * CSV
  * JSON
  * XML
  * Parquet
* 🗜 Optional Gzip compression
* 📊 Benchmark endpoint
* 🔗 REST API with Fastify

---

## 🏗 Architecture

```id="wq6mbp"
Client (Postman/Browser)
        ↓
   Fastify API (Node.js)
        ↓
   PostgreSQL Database
        ↓
 Streaming Writers (CSV/JSON/XML/Parquet)
        ↓
     HTTP Response (Stream)
```

---

## 📁 Project Structure

```id="of9fch"
Polyglot Data Export Engine/
│
├── source_code/
│   ├── server.js
│   ├── db.js
│   ├── exportService.js
│   ├── benchmark.js
│   └── writers/
│       ├── csvWriter.js
│       ├── jsonWriter.js
│       ├── xmlWriter.js
│       └── parquetWriter.js
│
├── init-db.sh
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 🐳 Running with Docker

### 1️⃣ Build & Start

```bash id="5xlp82"
docker compose up --build
```

App will run at:

```id="7pq2ra"
http://localhost:8080
```

---

### 2️⃣ Stop Containers

```bash id="kj1wqf"
docker compose down
```

---

## 🗄 Database

PostgreSQL runs inside Docker.

### Default Credentials

```id="6uub8e"
Host: db
Port: 5432
User: user
Password: password
Database: exports_db
```

---

## 📡 API Endpoints

### 🔹 1. Create Export Job

**POST** `/exports`

#### Request Body

```json id="7ol0d1"
{
  "format": "csv",
  "columns": ["id", "name", "value"],
  "compression": "gzip"
}
```

#### Response

```json id="1esqq5"
{
  "exportId": "uuid",
  "status": "pending"
}
```

---

### 🔹 2. Download Export

**GET** `/exports/:id/download`

Example:

```id="qz2uul"
GET http://localhost:8080/exports/<exportId>/download
```

📥 Downloads file in chosen format.

---

### 🔹 3. Benchmark

**GET** `/exports/benchmark`

Returns performance metrics.

---

## 📄 Supported Formats

| Format  | Content-Type                   | Compression |
| ------- | ------------------------------ | ----------- |
| CSV     | text/csv                       | ✅ gzip      |
| JSON    | application/json               | ✅ gzip      |
| XML     | application/xml                | ✅ gzip      |
| Parquet | application/vnd.apache.parquet | ❌           |

---

## 🧪 Testing with Postman

### Step 1 — Create Export

POST → `http://localhost:8080/exports`

### Step 2 — Download File

GET →

```id="b8s6t9"
http://localhost:8080/exports/<exportId>/download
```

---

## ⚙️ Environment Variables

```id="d40j9c"
PORT=8080
DATABASE_URL=postgres://user:password@db:5432/exports_db
```

---

## 🧰 Tech Stack

* Node.js 20
* Fastify
* PostgreSQL 13
* Docker & Docker Compose
* Streams API
* ParquetJS

---

## 📌 How It Works

1. User requests export via API
2. Job stored in memory
3. Writer streams data from PostgreSQL
4. Data transformed to requested format
5. Optional gzip compression
6. Stream sent to client

---

## 🛠 Troubleshooting

### ❌ ECONNREFUSED (DB connection)

✔ Ensure containers are running:

```bash id="hmh0rq"
docker ps
```

---

### ❌ Table not found

Rebuild DB volume:

```bash id="2z9r0l"
docker compose down -v
docker compose up --build
```








