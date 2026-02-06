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

---

### Backend

- n8n as orchestration and validation layer
- Firebase Firestore as persistent data store
- HTTP Webhooks as a clean API boundary

---

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

| Endpoint                    | Method | Description             |
| --------------------------- | ------ | ----------------------- |
| `/webhook/recipes`          | GET    | Retrieve stored recipes |
| `/webhook/generate-recipes` | POST   | Generate new recipes    |
| `/webhook/like-recipe`      | POST   | Increment recipe likes  |

---

## n8n Workflows

| Workflow File                              | Description                           |
| ------------------------------------------ | ------------------------------------- |
| `API – Generate Recipes main.json`         | Recipe generation, validation, repair |
| `Library – Recipes List _ Get Recipe.json` | Retrieve and sort stored recipes      |
| `Api – Like Recipe.json`                   | Increment recipe likes                |

---

## Getting Started

### Prerequisites

- n8n (local or cloud)
- Google Firebase project
- Firestore enabled
- Google Service Account with Firestore access

---

### Importing Workflows

1. Open n8n
2. Go to **Workflows → Import**
3. Import all workflow JSON files
4. Activate the workflows

---

### Required Configuration

#### Firebase

- Replace Google Service Account credentials in Firestore nodes
- Update `projectId` to your Firebase project ID

#### n8n

- Configure webhook base URL (local or deployed instance)

---

## Example Request

### Generate Recipes 

```http
POST /webhook/generate-recipes
Content-Type: application/json

{
  "ingredients": ["rice", "tofu", "onion"],
  "servings": 2,
  "preferences": {
    "cuisine": "Asian",
    "diet": "Vegetarian",
    "cookingTime": "Medium"
  },
  "helpers": {
    "count": 2
  }
}
```
---

## Downloading the n8n Workflows

The n8n workflows are provided as JSON files in this repository.
The n8n workflow JSON files are located in the `/n8n` directory at the repository root.

### Option 1: Download repository as ZIP (recommended)

1. Click **Code → Download ZIP** on GitHub
2. Extract the archive locally
3. Use the `.json` files inside the repository for n8n import

### Option 2: Download individual workflow files

1. Open a workflow `.json` file on GitHub
2. Click **Raw**
3. Save the file locally with a `.json` extension