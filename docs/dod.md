# Definition of Done

Every task is only complete when **all commands below pass with zero errors**.

Before marking any task complete, run each command in order, wait for it to finish, and paste the full terminal output in your response. A task without this output is **incomplete**.

## Commands

```bash
# Start the application (verify it starts without errors)
npm start
```

> **Note:** No lint script is configured in `package.json`. No build step is required (plain JavaScript). The `test` script is a placeholder that exits with an error — no automated test suite exists in the repository.
>
> The DoD gate for this repository is limited to verifying the application starts successfully. Update this file when lint, test, or build scripts are added.
