# G-CRM Backend API Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`  
**Authentication:** All protected routes require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <token>
```

Tokens are issued by the login endpoint and expire after **7 days**. If a user changes their password, existing tokens are invalidated immediately.

---

## Roles & Permission Overview

| Role | Description |
|---|---|
| `admin` | Full access to everything |
| `team leader` | Can manage their team and projects they lead/belong to |
| `data entry` | Basic authenticated access |
| `user` | Can only see leads assigned to them |

Legend used in this document:
- **Public** — No token required
- **Auth** — Any authenticated user (valid token)
- **Team Leader+** — `team leader` or `admin`
- **Admin** — `admin` only

---

## Auth

### POST `/auth/login`
**Permission:** Public

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "YourPassword1!"
}
```

**Response `201`:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin"
    },
    "token": "<jwt>"
  }
}
```

---

### POST `/auth/signup`
**Permission:** Admin

Creates a new user account. Only admins can create accounts.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "password": "StrongPass1!",
  "confirmPassword": "StrongPass1!",
  "role": "user"
}
```

> `role` must be one of: `admin`, `team leader`, `data entry`, `user`  
> Password must be strong: 8+ chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character.

**Response `201`:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "phone": "+1234567890"
    }
  }
}
```

---

## Users

### GET `/users/my-info`
**Permission:** Auth

Returns the currently authenticated user's profile.

**Response `201`:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "phone": "...",
      "role": "..."
    }
  }
}
```

---

### GET `/users`
**Permission:** Team Leader+

Returns all users. Team leaders only see members of projects they lead or belong to.

**Query Parameters (optional):**
| Param | Type | Description |
|---|---|---|
| `name` | string | Filter by name |
| `role` | string | Filter by role |
| `createdAt` | date | Filter by creation date |
| `fields` | string | Comma-separated fields to include (e.g. `name,email`) |

**Response `201`:**
```json
{
  "status": "success",
  "result": 5,
  "data": {
    "query": [...]
  }
}
```

---

### GET `/users/:userId`
**Permission:** Team Leader+

Returns a specific user's profile along with their associated projects and assigned leads.

**Response `201`:**
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "projects": [ ... ],
    "leads": [ ... ]
  }
}
```

---

### DELETE `/users/:userId`
**Permission:** Admin

Permanently deletes a user.

**Response `204`:** No body.

---

### PATCH `/users/update-my-info`
**Permission:** Auth

Updates the currently authenticated user's name, email, or phone.

**Request Body (any subset):**
```json
{
  "name": "New Name",
  "email": "new@example.com",
  "phone": "+9876543210"
}
```

**Response `201`:**
```json
{
  "status": "success",
  "data": { "user": { ... } }
}
```

---

### PATCH `/users/update-user/:userId`
**Permission:** Auth

Updates basic info (name, email, phone) for any user by ID.

**Request Body (any subset):**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+9876543210"
}
```

**Response `201`:**
```json
{
  "status": "success",
  "data": { "user": { ... } }
}
```

---

### PATCH `/users/update-user-role/:userId`
**Permission:** Admin

Changes a user's role.

**Request Body:**
```json
{
  "role": "team leader"
}
```

> `role` must be one of: `admin`, `team leader`, `data entry`, `user`

**Response `201`:**
```json
{
  "status": "success",
  "data": { "user": { ... } }
}
```

---

### PATCH `/users/change-my-password`
**Permission:** Auth

Allows the current user to change their own password. Issues a new token on success.

**Request Body:**
```json
{
  "oldPassword": "OldPass1!",
  "newPassword": "NewPass1!",
  "confirmPassword": "NewPass1!"
}
```

**Response `201`:**
```json
{
  "status": "success",
  "token": "<new_jwt>"
}
```

---

### PATCH `/users/change-password/:userId`
**Permission:** Admin

Admin resets another user's password without needing the old one.

**Request Body:**
```json
{
  "newPassword": "NewPass1!",
  "confirmPassword": "NewPass1!"
}
```

**Response `201`:**
```json
{
  "status": "success"
}
```

---

## Leads

All lead endpoints require authentication. Role-based filtering is applied server-side.

### GET `/leads`
**Permission:** Auth

Returns leads. Results are filtered by role:
- **Admin / Data Entry** — All leads with full populate (project, assignedTo)
- **Team Leader** — Leads belonging to projects they lead or are a member of
- **User** — Only leads assigned to them

**Query Parameters (optional):**
| Param | Type | Description |
|---|---|---|
| `name` | string | Filter by name |
| `phone` | string | Filter by phone |
| `email` | string | Filter by email |
| `address` | string | Filter by address |
| `status` | string | Filter by status |
| `source` | string | Filter by source |
| `createdAt` | date | Filter by creation date |
| `fields` | string | Comma-separated fields to include |
| `page` | number | Page number |
| `limit` | number | Results per page |

**Response `200`:**
```json
{
  "status": "success",
  "result": 10,
  "data": {
    "leads": [
      {
        "_id": "...",
        "name": "...",
        "phone": "...",
        "email": "...",
        "status": "new",
        "source": "facebook",
        "project": { ... },
        "assignedTo": { "name": "...", "email": "...", "phone": "...", "role": "..." },
        "notes": [ ... ],
        "createdAt": "..."
      }
    ]
  }
}
```

---

### POST `/leads`
**Permission:** Auth

Creates a new lead.

**Request Body:**
```json
{
  "name": "Lead Name",
  "phone": "+1234567890",
  "email": "lead@example.com",
  "address": "123 Main St",
  "status": "new",
  "source": "facebook"
}
```

| Field | Required | Values |
|---|---|---|
| `name` | Yes | string |
| `phone` | Yes | valid mobile number |
| `email` | No | valid email |
| `address` | No | string |
| `status` | No | `new`, `contacted`, `qualified`, `closed`, `lost`, `problem`, `solved` — default: `new` |
| `source` | No | `tik tok`, `snapchat`, `facebook`, `instagram`, `recommended`, `other` — default: `other` |

**Response `200`:**
```json
{
  "status": "success",
  "data": { "lead": { ... } }
}
```

---

### GET `/leads/status-stats`
**Permission:** Auth

Returns a count of leads grouped by status. Users only see counts for their assigned leads.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "stats": [
      { "status": "new", "count": 5 },
      { "status": "contacted", "count": 3 },
      { "status": "qualified", "count": 2 },
      { "status": "closed", "count": 7 },
      { "status": "lost", "count": 1 },
      { "status": "problem", "count": 0 },
      { "status": "solved", "count": 4 }
    ]
  }
}
```

---

### GET `/leads/:leadId`
**Permission:** Auth

Returns a single lead by ID.

**Response `200`:**
```json
{
  "status": "success",
  "data": { "lead": { ... } }
}
```

---

### PATCH `/leads/:leadId`
**Permission:** Auth

Updates a lead's fields.

**Request Body (any subset of allowed fields):**
```json
{
  "name": "Updated Name",
  "phone": "+9876543210",
  "status": "contacted",
  "source": "instagram"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "data": { "lead": { ... } }
}
```

---

### DELETE `/leads/:leadId`
**Permission:** Admin

Permanently deletes a lead.

**Response `204`:** No body.

---

### POST `/leads/:leadId/notes`
**Permission:** Auth

Adds a note to a lead.

**Request Body:**
```json
{
  "note": "Called the client, no answer.",
  "createdBy": "<userId>"
}
```

> `note` must be at least 5 characters. `createdBy` must be a valid User ID.

**Response `201`:**
```json
{
  "status": "success",
  "data": { "lead": { ... } }
}
```

---

### DELETE `/leads/:leadId/notes/:noteId`
**Permission:** Auth

Removes a specific note from a lead.

**Response `204`:** No body.

---

### PATCH `/leads/assign-to-user/:userId`
**Permission:** Team Leader+

Bulk-assigns a list of leads to a specific user.

**Request Body:**
```json
{
  "leads": ["leadId1", "leadId2", "leadId3"]
}
```

**Response `203`:**
```json
{
  "status": "success"
}
```

---

### PATCH `/leads/assign-to-project/:projectId`
**Permission:** Auth

Bulk-assigns a list of leads to a specific project.

**Request Body:**
```json
{
  "leads": ["leadId1", "leadId2"]
}
```

**Response `200`:**
```json
{
  "status": "success"
}
```

---

## Projects

### GET `/projects`
**Permission:** Admin

Returns all projects with fully populated leads, leader, and team.

**Response `200`:**
```json
{
  "status": "success",
  "result": 3,
  "data": {
    "projects": [
      {
        "_id": "...",
        "name": "...",
        "description": "...",
        "leader": { "name": "...", "email": "...", "phone": "..." },
        "team": [ { "name": "...", "email": "...", "phone": "..." } ],
        "leads": [ ... ],
        "createdBy": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

---

### POST `/projects`
**Permission:** Admin

Creates a new project. The `createdBy` field is automatically set to the authenticated admin.

**Request Body:**
```json
{
  "name": "Project Alpha",
  "description": "Sales campaign for Q3"
}
```

**Response `201`:**
```json
{
  "status": "success",
  "data": { "project": { ... } }
}
```

---

### GET `/projects/my-projects`
**Permission:** Auth

Returns all projects where the current user is either the `leader` or a `team` member.

**Response `200`:**
```json
{
  "status": "success",
  "result": 2,
  "data": {
    "projects": [ ... ]
  }
}
```

---

### GET `/projects/:projectId`
**Permission:** Auth

Returns full details for a single project, including all leads, team members, and leader.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "project": {
      "_id": "...",
      "name": "...",
      "description": "...",
      "leader": { "name": "...", "email": "...", "phone": "..." },
      "team": [ ... ],
      "leads": [
        {
          "assignedTo": { "name": "...", "email": "...", "phone": "...", "role": "..." },
          "project": { "name": "...", "description": "..." },
          ...
        }
      ],
      "createdBy": { "name": "..." },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

### PATCH `/projects/:projectId`
**Permission:** Admin

Updates a project's name or description.

**Request Body (any subset):**
```json
{
  "name": "New Project Name",
  "description": "Updated description"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "data": { "project": { ... } }
}
```

---

### DELETE `/projects/:projectId`
**Permission:** Admin

Permanently deletes a project.

**Response `204`:** No body.

---

### PATCH `/projects/:projectId/:userId`
**Permission:** Admin

Assigns a user as the project leader. The user must have the role `team leader` or `admin`.

**Response `200`:**
```json
{
  "status": "success",
  "data": { "project": { ... } }
}
```

---

### PATCH `/projects/:projectId/add-user`
**Permission:** Team Leader+

Adds one or more users to the project's team. Uses `$addToSet` so duplicates are ignored.

**Request Body:**
```json
{
  "users": ["userId1", "userId2"]
}
```

**Response `200`:**
```json
{
  "status": "success",
  "data": { "project": { ... } }
}
```

---

### PATCH `/projects/:projectId/remove-user`
**Permission:** Team Leader+

Removes one or more users from the project's team.

**Request Body:**
```json
{
  "users": ["userId1", "userId2"]
}
```

**Response `200`:**
```json
{
  "status": "success",
  "data": { "project": { ... } }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "fail",
  "message": "Human-readable error description"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad request — missing or invalid fields |
| `402` | Payment Required (used for missing password fields) |
| `403` | Forbidden — not authenticated or not authorized |
| `404` | Not found — resource doesn't exist |
| `500` | Internal server error |

---

## Quick Permissions Reference

| Endpoint | Public | User | Data Entry | Team Leader | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| POST `/auth/login` | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST `/auth/signup` | | | | | ✅ |
| GET `/users/my-info` | | ✅ | ✅ | ✅ | ✅ |
| GET `/users` | | | | ✅ | ✅ |
| GET `/users/:userId` | | | | ✅ | ✅ |
| DELETE `/users/:userId` | | | | | ✅ |
| PATCH `/users/update-my-info` | | ✅ | ✅ | ✅ | ✅ |
| PATCH `/users/update-user/:userId` | | ✅ | ✅ | ✅ | ✅ |
| PATCH `/users/update-user-role/:userId` | | | | | ✅ |
| PATCH `/users/change-my-password` | | ✅ | ✅ | ✅ | ✅ |
| PATCH `/users/change-password/:userId` | | | | | ✅ |

| GET `/leads` | | ✅ | ✅ | ✅ | ✅ |
| POST `/leads` | | ✅ | ✅ | ✅ | ✅ |
| GET `/leads/status-stats` | | ✅ | ✅ | ✅ | ✅ |
| GET `/leads/:leadId` | | ✅ | ✅ | ✅ | ✅ |
| PATCH `/leads/:leadId` | | ✅ | ✅ | ✅ | ✅ |
| DELETE `/leads/:leadId` | | | | | ✅ |
| POST `/leads/:leadId/notes` | | ✅ | ✅ | ✅ | ✅ |
| DELETE `/leads/:leadId/notes/:noteId` | | ✅ | ✅ | ✅ | ✅ |
| PATCH `/leads/assign-to-user/:userId` | | | | ✅ | ✅ |
| PATCH `/leads/assign-to-project/:projectId` | | ✅ | ✅ | ✅ | ✅ |

| GET `/projects` | | | | | ✅ |
| POST `/projects` | | | | | ✅ |
| GET `/projects/my-projects` | | ✅ | ✅ | ✅ | ✅ |
| GET `/projects/:projectId` | | ✅ | ✅ | ✅ | ✅ |
| PATCH `/projects/:projectId` | | | | | ✅ |
| DELETE `/projects/:projectId` | | | | | ✅ |
| PATCH `/projects/:projectId/:userId` | | | | | ✅ |
| PATCH `/projects/:projectId/add-user` | | | | ✅ | ✅ |
| PATCH `/projects/:projectId/remove-user` | | | | ✅ | ✅ |