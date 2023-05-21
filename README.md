## Oscar Ox

To run the project locally, you will need to have [Node.js](https://nodejs.org/en/) installed.

You will also need to have [Docker](https://www.docker.com/) installed.

Finally you will also need to have the [Supabase CLI](https://supabase.io/docs/guides/cli) installed.

# Running the project locally

Start supabase with ```supabase start```

Create an .env.local file in the client root directory and add the following variables:
    
    ``` 
    NEXT_PUBLIC_STAGE=dev
    NEXT_PUBLIC_URL=http://localhost:3000
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

Start the frontend with ```npm run dev```

