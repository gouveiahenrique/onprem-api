# Definition of Done

Every task is only complete when **all commands below pass with zero errors**.

Before marking any task complete, run each command in order, wait for it to finish, and paste the full terminal output in your response. A task without this output is **incomplete**.

## Commands

```bash
# Start the server and verify it responds (manual smoke test)
npm start
```

> **Note**: No lint script and no test suite are defined in `package.json`.
> - The `test` script exits with code 1 by design (`echo "Error: no test specified" && exit 1`).
> - No `lint` script exists in `package.json`.
>
> Until a test suite and linter are introduced, the only automated gate available is verifying the server starts without error and responds to requests.
