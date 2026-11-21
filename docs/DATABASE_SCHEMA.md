# CIVICLENS — DATABASE ARCHITECTURE & SCHEMA

## Overview
CivicLens employs a structured, persistent relational schema stored atomically in `server/data/civiclens_db.json`. Every state change uses temporary staging files and atomic renames to prevent partial writes.

---

## Entity Relationship Model

```
 ┌──────────────────────┐         1:1         ┌────────────────────────┐
 │     COMPLAINTS       │─────────────────────│        TICKETS         │
 ├──────────────────────┤                     ├────────────────────────┤
 │ id (PK)              │                     │ id (PK)                │
 │ originalText         │                     │ complaintId (FK)       │
 │ language             │                     │ category               │
 │ photoUrl             │                     │ severity               │
 │ location             │                     │ reason                 │
 │ ward                 │                     │ department             │
 │ submittedAt          │                     │ priorityScore          │
 └──────────────────────┘                     │ status                 │
                                              │ aiConfidence           │
                                              │ manualReviewRequired   │
                                              │ summary                │
                                              │ officerNotes           │
                                              │ duplicateGroupId (FK)  │
                                              │ createdAt              │
                                              │ updatedAt              │
                                              └──────────┬─────────────┘
                                                         │
                                  ┌──────────────────────┼─────────────────────┐
                                  │ 1:N                  │ N:1                 │
                                  ▼                      ▼                     ▼
                       ┌─────────────────────┐  ┌──────────────────┐  ┌───────────────────┐
                       │    ACTIVITY_LOGS    │  │ DUPLICATE_GROUPS │  │    DEPARTMENTS    │
                       ├─────────────────────┤  ├──────────────────┤  ├───────────────────┤
                       │ id (PK)             │  │ id (PK)          │  │ id (PK)           │
                       │ ticketId (FK)       │  │ primaryTicketId  │  │ name              │
                       │ action              │  │ relatedTicketIds │  │ category          │
                       │ previousStatus      │  │ similarityScore  │  └───────────────────┘
                       │ newStatus           │  │ detectedReason   │
                       │ performedBy         │  │ createdAt        │
                       │ details             │  └──────────────────┘
                       │ timestamp           │
                       └─────────────────────┘
```

---

## Table Definitions

### 1. `complaints`
Stores the raw citizen submission with strict preservation of the original text and linguistic integrity.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique identifier (e.g. `CMP-8801`) |
| `originalText` | String | Yes | Verbatim text submitted by citizen |
| `language` | String | Yes | Detected language (`English`, `Kannada`, `Hindi`) |
| `photoUrl` | String | No | Attached photo evidence (Base64 or URL) |
| `location` | String | Yes | Street address or landmark |
| `ward` | String | Yes | Assigned municipal ward |
| `submittedAt` | ISO Date | Yes | Submission timestamp |

---

### 2. `tickets`
The core operational unit utilized by municipal dispatchers and field engineers.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique identifier (e.g. `TKT-1001`) |
| `complaintId` | String | Yes | References `complaints.id` |
| `category` | Enum | Yes | `Roads`, `Waste`, `Water`, `Electricity`, `Trees`, `Drainage` |
| `severity` | Enum | Yes | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `reason` | String | Yes | 1-line explainable justification |
| `department` | String | Yes | Deterministic department mapping |
| `priorityScore` | Integer | Yes | Explainable score (10 to 100) |
| `status` | Enum | Yes | `Pending`, `In Progress`, `Resolved` |
| `aiConfidence` | Float | Yes | Model confidence between 0.0 and 1.0 |
| `manualReviewRequired`| Boolean | Yes | Flag if confidence is below 0.75 |
| `summary` | String | Yes | Normalized English summary |
| `officerNotes` | String | No | Internal notes left by triage officer |
| `duplicateGroupId` | String | No | References `duplicateGroups.id` if clustered |
| `createdAt` | ISO Date | Yes | Creation timestamp |
| `updatedAt` | ISO Date | Yes | Last update timestamp |

---

### 3. `duplicateGroups`
Clusters redundant citizen reports regarding the same physical incident without deleting any submissions.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique identifier (e.g. `DUP-1795239...`) |
| `primaryTicketId` | String | Yes | Lead ticket dispatched to field crews |
| `relatedTicketIds` | Array<String> | Yes | Array of clustered ticket IDs |
| `similarityScore` | Float | Yes | Semantic and spatial overlap score (0.0 to 1.0) |
| `detectedReason` | String | Yes | Explanation of duplicate grouping |
| `createdAt` | ISO Date | Yes | Timestamp of cluster detection |

---

### 4. `activityLogs`
Provides an immutable audit trail for every triage action, department re-route, and status transition.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique identifier (e.g. `LOG-1795239...`) |
| `ticketId` | String | Yes | References `tickets.id` |
| `action` | String | Yes | `SUBMITTED`, `UPDATED`, `ROUTED`, `RESOLVED` |
| `previousStatus` | String | No | Status before action |
| `newStatus` | String | Yes | Status after action |
| `performedBy` | String | Yes | Actor (`Citizen`, `CivicLens AI System`, `Officer`) |
| `details` | String | Yes | Human-readable explanation of change |
| `timestamp` | ISO Date | Yes | Action timestamp |
