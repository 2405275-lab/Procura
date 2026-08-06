# Veridion REST API Reference

The FastAPI backend exposes interactive OpenAPI docs at `http://localhost:8000/docs`.

## 1. Authentication Endpoints

### Login
`POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "sarah.j@veridion.io",
    "password": "password"
  }
  ```
- **Response**: JWT session credentials and user profile information.

---

## 2. Requisition Endpoints

### List Requests
`GET /purchase-requests`
- **Response**: List of all purchase requests.

### Create Request
`POST /purchase-requests`
- **Response**: The newly initialized purchase request.

---

## 3. Quotation Endpoints

### Upload Invoice File
`POST /quotations/upload`
- **Content-Type**: `multipart/form-data`
- **Parameters**: `request_id`, `file`
- **Response**: Calls the OCR & Extraction agent pipeline and returns the extracted JSON fields.
