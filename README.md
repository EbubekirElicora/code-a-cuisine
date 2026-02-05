# Code-a-Cuisine 🍽️
## AI-assisted recipe generation with robust validation and persistence

---

## Overview

Code-a-Cuisine is a full-stack web application that generates cooking recipes based on user-provided ingredients and preferences.

The project combines:
- Angular frontend
- n8n backend orchestration
- Firebase Firestore for persistence
- Large Language Models (LLMs) for recipe generation

The main focus of the project is robustness, validation, and predictable behavior when working with AI-generated data.

---

## Architecture

### Frontend
- Angular (Standalone Components)
- Clear separation of concerns:
  - `core/recipes` – domain models, mappers, utilities
  - `services` – API access and application state
- No business logic inside UI components
- Defensive rendering and error handling

### Backend
- n8n as orchestration and validation layer
- Firebase Firestore as persistent data store
- HTTP Webhooks as a clean API boundary

### AI Integration
- LLMs are used only for generating recipe proposals
- All AI output is treated as untrusted input
- No AI-generated data is stored or displayed without validation

---

## Data Flow – Recipe Generation

1. User selects ingredients, servings, and preferences
2. Frontend sends a request to an n8n webhook
3. n8n triggers an LLM prompt
4. The LLM response is:
   - parsed
   - validated
   - classified as valid, soft-fail, or hard-fail
5. Based on the result:
   - Valid → stored immediately
   - Soft-fail → automatically repaired → stored
   - Hard-fail → regenerated or rejected
6. Only validated data reaches Firestore and the frontend

---

## Validation and Error Handling

- Strict schema validation of all generated data
- Automatic repair for recoverable AI errors
- Clear separation between recoverable and non-recoverable failures
- No persistence of invalid or incomplete data
- Graceful frontend degradation on backend errors

---

## API Endpoints

| Endpoint | Method | Description |
|--------|--------|-------------|
| `/webhook/recipes` | GET | Retrieve stored recipes |
| `/webhook/generate-recipes` | POST | Generate new recipes |
| `/webhook/like-recipe` | POST | Increment recipe likes |

---

## Development Principles

- No hard-coded business data
- Configuration over assumptions
- Validation before persistence
- Explicit and traceable data flow
- Predictable behavior under failure conditions

---

## Why n8n?

n8n is intentionally used instead of a traditional backend to:
- Visualize complex AI workflows
- Centralize validation and repair logic
- Reduce coupling between frontend and AI logic
- Enable rapid iteration without compromising stability

---

## Disclaimer

AI-generated content is inherently probabilistic.

This project demonstrates a defensive and responsible approach to integrating AI systems into production-grade applications.