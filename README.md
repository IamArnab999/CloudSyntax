# Cloud Development Environment!

This project is a cloud-based development environment designed to provide a collaborative coding experience with integrated AI assistance. It offers features like real-time code editing, integrated terminal access, project management, and the ability to interact with AI agents for various coding tasks, including code generation and file manipulation.

## Project Functionality

The core purpose of this project is to provide a seamless and intelligent environment for developers to work on their projects from anywhere. Key functionalities include:

*   **Cloud-Based Workspace:** Access and work on your projects from any web browser.
*   **Real-time Collaboration:** Collaborate with other users on the same project in real time.
*   **Integrated Terminal:** Execute commands and manage your project directly within the environment.
*   **Code Editor:** A feature-rich code editor with syntax highlighting and other standard IDE features.
*   **Project Management:** Create, open, and manage multiple projects.
   
## Project Structure

The project is organized into several key directories and files:

*   `.idx/`: Contains development environment configuration files, such as `dev.nix`.
*   `public/`: Contains public assets like `favicon.ico`, `placeholder.svg`, and `robots.txt`.
*   `src/`: The main source code directory.
    *   `components/`: Contains reusable React components for the UI, including `CodeEditor.tsx`, `Terminal.tsx`, and various UI elements in `components/ui/`.
    *   `contexts/`: Houses React context providers for managing application state, like `AuthContext.tsx` and `RoomContext.tsx`.
    *   `hooks/`: Custom React hooks for various functionalities, such as `use-code-execution.tsx` and `use-project.tsx`.
    *   `lib/`: Utility functions and library configurations, including `firebase.ts` and `utils.ts`.
    *   `pages/`: React components representing different pages of the application, such as `Auth.tsx`, `Index.tsx`, and `NotFound.tsx`.
    *   `services/`: Contains service files for interacting with backend APIs and external services, like `codeExecutionService.ts` and `projectService.ts`.
    *   `integrations/`: Code for integrating with external services, such as `supabase/`.
    *   `App.css`, `App.tsx`: The main application component and its styles.
    *   `index.css`, `main.tsx`: Entry point of the application.
    *   `vite-env.d.ts`: TypeScript declaration file for Vite environment variables.
*   `supabase/`: Contains configuration files for Supabase, such as `config.toml`.
*   `package.json`, `package-lock.json`, `bun.lockb`: Project dependencies and scripts.
*   `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configuration files.
*   `vite.config.ts`: Vite build configuration.
*   `eslint.config.js`: ESLint configuration for code linting.
*   `postcss.config.js`, `tailwind.config.ts`: Stylesheet processing and Tailwind CSS configuration.
*   `components.json`: Configuration for shadcn/ui components.

## Setup and Running Locally

To set up and run this project locally, follow these steps:

1.  **Clone the repository:**
    
```bash
git clone <repository_url>
    cd <project_directory>
```

2.  **Install dependencies:**
    
```bash
npm install
    # or using yarn: yarn install
    # or using bun: bun install
```

3.  **Set up Supabase:** This project relies on Supabase for authentication and data storage.
    *   Create a new project on the [Supabase website](https://supabase.com/).
    *   Obtain your Supabase URL and `anon` public key.
    *   Configure your Supabase database with the necessary tables and RLS policies for projects and user data. Refer to the Supabase documentation for details.
    *   Create a `.env` file in the project root and add your Supabase credentials:
        
```
env
        VITE_SUPABASE_URL=<your_supabase_url>
        VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```
    *   You might also need to set up Firebase for additional features if used (check `src/lib/firebase.ts`).

4.  **Configure AI Agent API:** The AI agent features require access to an AI model API (e.g., OpenAI, Google AI).
    *   Obtain an API key for your chosen AI model.
    *   Configure the application to use your API key. This might involve setting environment variables or modifying a configuration file (check `src/services/codeExecutionService.ts` or similar files).

5.  **Run the development server:**
    
```bash
npm run dev
    # or using yarn: yarn dev
    # or using bun: bun dev
```
    The application should now be running at `http://localhost:5173/` (or a similar port).

## Using AI Agent Features

The integrated AI agents can assist with various coding tasks. Depending on the implementation, you can interact with the AI through:

*   **Context Menus:** Right-click in the code editor to access AI actions like "Generate Code," "Refactor," or "Add Documentation."
*   **Dedicated UI Elements:** There might be a specific panel or input area for interacting with the AI agent.
*   **Commands:** Use specific commands in the terminal or a command palette to trigger AI actions.

Refer to the application's UI and documentation (if available) for specific instructions on how to utilize the AI features within the running environment. For tasks like file manipulation via AI, the agent would likely expose commands or functions that interact with the project's file system through the backend.

## Contributing

We welcome contributions to this project! Please see the `CONTRIBUTING.md` file (if it exists) for guidelines on how to contribute.

## Licensing

This project is licensed under the [MIT License](LICENSE) - see the `LICENSE` file for details.

## Known Issues

*   [List any known issues or bugs here.]
*   [Example: Real-time collaboration might experience minor latency under high network load.]
*   [Example: AI agent responses might vary depending on the model and prompt.]
