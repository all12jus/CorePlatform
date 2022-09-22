This project is intended on being the core of a for most of the web based projects I'll be building for the future.

Every endpoint has to be fully tested and must return a JSON response.

Example of a response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe"
    }
}
```

Errors must be handled and returned as a JSON response. Example:

```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "Not Found",
    "description": "The requested resource was not found."
  }
}
```


## Endpoints

Planned Endpoints:

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/logout
- POST /api/auth/logout
