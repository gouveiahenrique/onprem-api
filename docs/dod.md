# Definition of Done

Every task is only complete when **all commands below pass with zero errors**.

Before marking any task complete, run each command in order, wait for it to finish, and paste
the full terminal output in your response. A task without this output is **incomplete**.

## Commands

```bash
npm test
```

## Rules

- Run all commands even if an earlier one fails — report all failures together.
- Do not suppress, skip, or ignore any failure.
- Fix the root cause and re-run from step 1 until all commands pass.
- If a command is not applicable for the change, explain why — do not silently skip it.

## Notes

- `package.json` (lines 6-9) defines only two scripts: `test` and `start`. There is no `lint` or `build` script defined.
- The `test` script itself is a placeholder (`"echo \"Error: no test specified\" && exit 1"`, `package.json:7`) that always exits non-zero. This is the project's current, unmodified DoD gate as discovered from build tooling configuration — no lint or build commands exist to include.
