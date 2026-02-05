Code-a-Cuisine 🍽️

AI-assisted recipe generation with robust validation and persistence

Overview

Code-a-Cuisine is a full-stack web application that generates cooking recipes based on user-provided ingredients and preferences.
The project combines an Angular frontend with an n8n-based backend orchestration layer, Firebase/Firestore for persistence, and Large Language Models (LLMs) for recipe generation.

The primary goal of the project is robustness and reliability when working with AI-generated data.

Architecture
Frontend

Angular (Standalone Components)

Clear separation of concerns:

core/recipes: domain models, mappers, utilities

services: API access and application state

No business logic in components

Defensive rendering and error handling

Backend

n8n as orchestration and validation layer

Firebase Firestore as the persistent data store

HTTP Webhooks as a clean API boundary

AI Integration

LLMs are used exclusively for generating recipe proposals.
All AI output is treated as untrusted input and is strictly validated before use.

Data Flow (Recipe Generation)

User selects ingredients, servings, and preferences

Frontend sends a request to the n8n webhook

n8n triggers an LLM prompt

The LLM response is:

Parsed

Validated

Categorized as valid, soft-fail, or hard-fail

Depending on the result:

Valid data is stored directly

Soft-fail data is automatically repaired

Hard-fail data is regenerated or rejected

Only validated recipes are persisted and returned to the frontend

This approach ensures that malformed AI responses never reach the UI or the database.

Validation & Error Handling

Strict schema validation of all generated data

Automatic repair for recoverable AI errors

Clear separation between recoverable and non-recoverable failures

No persistence of invalid or incomplete data

Graceful frontend degradation in case of backend errors

API Endpoints (via n8n)
Endpoint	Method	Description
/webhook/recipes	GET	Retrieve stored recipes
/webhook/generate-recipes	POST	Generate new recipes
/webhook/like-recipe	POST	Increment recipe likes
Development Principles

No hard-coded business data

Configuration over assumptions

Validation before persistence

Explicit data flow

Predictable behavior under failure conditions

Why n8n?

n8n is used intentionally as a backend orchestration layer to:

Visualize and control complex AI workflows

Centralize validation and repair logic

Reduce coupling between frontend and AI logic

Enable rapid iteration without compromising stability

Disclaimer

AI-generated content is inherently probabilistic.
This project demonstrates a defensive and responsible approach to integrating AI systems into production-grade applications.