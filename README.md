# Travel App Demo

Skeleton conversational travel app that allows users to find and view points of interest on a map via chat. Built with OpenAI Chat Completions API and Google Maps SDK.

## Setup Dev Env

1. Install Docker Desktop to manage Supabase Functions via Supabase CLI: https://docs.docker.com/desktop/install/mac-install/
2. Install Deno VS Code extension for static code checking: https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno
3. Replace `.env.example` in `supabase/functions` with `.env` and secrets
4. Replace `.env.example` in `travelapp` with `.env` and secrets
   1. Local Supabase Function URL: http://localhost:54321/functions/v1/chat-completion
   2. Hosted Supabase Function URL: https://lmptepslcpnzbdcbkmqd.supabase.co/functions/v1/chat-completion

## Run App Locally

### Frontend

1. Navigate to `travelapp` folder
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

### Backend

1. Start Docker Desktop
2. Navigate to `supabase` folder
3. Run `supabase start` to start Supabase locally
4. Run `supabase functions serve` to start Supabase Functions locally

### Visit App

1. Go to `http://localhost:5173/` in a browser
2. Ask in the chat to show locations of interest in Sydney
3. Observe chat response andlocation pins on the map
