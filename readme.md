# Hazel - AI Chat Assistant

## Overview

- A React + TypeScript frontend with markdown support and chat UI
- A Supabase backend (Postgres + Edge Functions) to handle user state, chat history, and AI message generation
- OpenAI's GPT models to generate natural, engaging responses

---

## Frontend

**Tech Stack**:

- React.js
- TypeScript
- Tailwind CSS
- React Markdown (`react-markdown`)
- Supabase client SDK

### Key Features

- **Persistent User ID**: The frontend stores a UUID in `localStorage` to track each user anonymously.
- **Chat Interface**: Messages are styled with Tailwind CSS and support Markdown formatting using `react-markdown`.
- **Markdown Rendering**: Assistant replies are rendered with full formatting (bold, lists, etc.).
- **Copy to Clipboard**: Users can copy assistant replies.
- **Sidebar & Model Selection**: Side navigation to control model choice.

### File Structure Highlights

- `src/chat.tsx`: Main chat UI logic and layout
- `src/utils/constants.ts`: API endpoints and headers
- `src/components/`: Input bar, Sidebar

---

## Backend

**Tech Stack**:

- Supabase Edge Functions (Deno)
- Supabase Postgres (for users and messages)
- OpenAI API

### Key Features

- **User Management**: Automatically creates a new user (UUID) on first interaction.
- **Chat History**: Every message is stored in the `messages` table for context.
- **AI Assistant Logic**:
  - Constructs a conversation using previous history
  - Uses GPT to generate responses
- **User Info Extraction**: After a few exchanges, the backend uses OpenAI to infer name, age, and gender if not explicitly provided.

### Database Tables

- `users`: id(PK, UUID), name, age, gender, created/updated timestamps
- `messages`: id(PK, bigInt), user_id(FK), role (`user` or `assistant`), content, and timestamp

### Edge Function

Located in `supabase/functions/chat-handler/index.ts`, this function:

- Handles POST requests from the frontend
- Manages user creation and lookup
- Builds context and sends to OpenAI
- Saves assistant responses and user messages to the database
- Infers user info and updates the user record
