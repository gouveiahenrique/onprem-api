# Definition of Done

Every task is only complete when **all commands below pass with zero errors**.

Before marking any task complete, run each command in order, wait for it to finish, and paste the full terminal output in your response. A task without this output is **incomplete**.

## Commands

```bash
# Install dependencies
npm install

# Start the server (manual verification — no automated test suite exists)
npm start
```

> **Note:** The `test` script in `package.json` is a non-functional placeholder that always exits with code `1`:
> ```
> "test": "echo \"Error: no test specified\" && exit 1"
> ```
> No lint script is defined. No build step is required (the application runs directly from source via `node index.js`).
>
> Until a test suite and linter are introduced, the DoD gate for this project is limited to a successful `npm install` and a verified running server (`npm start` outputs `API server running at http://localhost:3000` without error).
