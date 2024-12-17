# Travel App Demo

## Setup Dev Env

1. Install Docker Desktop to manage Supabase Functions via Supabase CLI: https://docs.docker.com/desktop/install/mac-install/
2. Install Deno VS Code extension for static checking: https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno
3. Replace `.env.example` in `supabase/functions` with relevant env file and secrets
4. Replace `.env.example` in `travelapp` with relevant env file and secrets
   1. Local Supabase Function URL: http://localhost:54321/functions/v1/chat-completion
   2. Hosted Supabase Function URL: https://lmptepslcpnzbdcbkmqd.supabase.co/functions/v1/chat-completion

## Run Dev Env

### Frontend

1. Navigate to `travelapp` folder
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

### Backend

1. Start Docker Desktop
2. Navigate to `supabase` folder
3. Run `supabase start` to start Supabase locally
4. Run `supabase functions serve` to start Supabase Functions locally
