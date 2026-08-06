# Contributing to Procura

We welcome contributions to Procura!

## Development Guidelines

1. **Code Quality**: Keep component responsibilities modular and type-safe. Ensure types are exported correctly using `import type { ... }` from `@/types` under `verbatimModuleSyntax` rules.
2. **Backend Setup**: Always write unit test blocks inside `backend/test_main.py` when introducing new REST routes.
3. **Frontend Linting**: Confirm that frontend scripts pass linter checks: `npm run build` or `oxlint`.
