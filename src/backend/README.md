# PDF Editor Backend

This is the backend service for the PDF Editor Contract Management module.

## Prerequisites

- Node.js
- MongoDB

## Installation

1. Navigate to the backend directory:
   ```bash
   cd pdf-js/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application uses default configuration. You can create a `.env` file to override defaults:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pdf-editor
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Documents
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get a specific document
- `POST /api/documents` - Create a new document
- `PUT /api/documents/:id` - Update a document
- `DELETE /api/documents/:id` - Delete a document
- `POST /api/documents/upload` - Upload a PDF file

### Contracts
- `GET /api/contracts` - List all contracts
- `GET /api/contracts/:id` - Get a specific contract
- `POST /api/contracts` - Create a new contract
- `PUT /api/contracts/:id` - Update a contract
- `DELETE /api/contracts/:id` - Delete a contract

### Settings
- `GET /api/settings` - Get global settings
- `PUT /api/settings` - Update global settings
