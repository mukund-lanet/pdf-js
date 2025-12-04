# MongoDB Setup Guide

This guide explains how MongoDB is set up for the Contract Management application.

## 1. Connection

The application connects to MongoDB using the connection string provided in the `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/pdf-editor
```

If you are using a cloud provider (like MongoDB Atlas) or a different local setup, simply update this `MONGO_URI` variable.

## 2. Database and Collections

**You do NOT need to manually create databases or tables (collections).**

The application uses **Mongoose**, an Object Data Modeling (ODM) library for MongoDB and Node.js. Mongoose handles the creation of the database and collections automatically when the application first tries to save data.

### Schema Structure

The application will automatically create the following collections in your `pdf-editor` database:

1.  **`documents`**: Stores individual document data.
    -   Fields: `name`, `status`, `signers`, `uploadPath` (Firebase path), `canvasElements` (editor state), etc.
2.  **`contracts`**: Stores contract metadata.
    -   Fields: `name`, `value`, `startDate`, `endDate`, etc.
3.  **`settings`**: Stores global application settings.
    -   Fields: `identityVerification`, `branding`, etc.
4.  **`contractmanagements`**: The main state aggregator.
    -   Fields: References to `documents` and `contracts`, plus `stats` and `filters`.

## 3. Using MongoDB Compass

Since you have MongoDB Compass installed:

1.  Open MongoDB Compass.
2.  Paste your connection string (e.g., `mongodb://localhost:27017/pdf-editor`) and connect.
3.  Initially, you might not see the `pdf-editor` database if it's empty.
4.  Once you run the backend and create a document via the API (or the frontend once integrated), refresh Compass.
5.  You will see the `pdf-editor` database and the collections listed above.

## 4. Data Flow

1.  **Frontend** uploads PDF to Firebase Storage.
2.  **Frontend** gets the download URL (or path).
3.  **Frontend** sends this path + metadata to Backend API (`POST /api/documents/upload`).
4.  **Backend** saves the document with the `uploadPath` to MongoDB.
5.  **Backend** updates the `ContractManagement` state to include the new document reference.
