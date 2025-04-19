# Setup Instructions

## Frontend

The frontend is built with **React.js** and located in the `Hazel/frontend` directory.

### Steps to Run:

```bash
cd Hazel/frontend
npm install      # Install all dependencies
npm start        # Start the frontend server
```

This will start the app on `http://localhost:3000`, unless the port is already in use.

---

## Backend

The backend is built with **TypeScript** using **Supabase Edge Functions**, connected to a **Supabase Postgres** database.

### Steps to Run:

1. **Start Supabase**

   Run the following command to start Supabase:

   ```bash
   supabase start
   ```

   > **Note:** If the Supabase CLI is not installed, refer to the Supabase CLI Installation Guide to set it up first.

2. **Once Supabase is running, you will see endpoints like:**

   ```
   API URL:            http://127.0.0.1:54321
   GraphQL URL:        http://127.0.0.1:54321/graphql/v1
   S3 Storage URL:     http://127.0.0.1:54321/storage/v1/s3
   DB URL:             postgresql://postgres:postgres@127.0.0.1:54322/postgres
   Studio URL:         http://127.0.0.1:54323
   Inbucket URL:       http://127.0.0.1:54324
   JWT Secret:         super-secret-jwt-token-with-at-least-32-characters-long
   anon key:           XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   service_role key:   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   S3 Access Key:      XXXXXXXXXXXXXX
   S3 Secret Key:      XXXXXXXXXXXXXX
   S3 Region:          local
   ```

3. **Serve Edge Functions**

   Navigate to the `supabase/functions` directory and serve the functions using:

   ```bash
   supabase functions serve --env-file supabase/functions/.env
   ```

   This ensures the edge functions are running and using the appropriate environment variables defined in `.env`.

---

## Final Step

With both the frontend and backend running, you can now interact with your AI assistant through the frontend interface.
