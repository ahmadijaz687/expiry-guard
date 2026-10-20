# Contributing to ExpiryGuard

Thank you for your interest in contributing to **ExpiryGuard**! We welcome contributions to make home kitchen inventory and waste reduction even simpler and more effective.

## Development Workflow

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/ahmadijaz687/expiry-guard.git
   cd expiry-guard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Run test suite**:
   ```bash
   npm test
   ```

5. **Run type-check & build**:
   ```bash
   npm run build
   ```

## Commit Guidelines
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` for new capabilities or algorithms
- `fix:` for bug fixes
- `docs:` for documentation updates
- `test:` for adding or updating unit tests
- `chore:` for dependency updates and build tool configs

## Pull Request Process
1. Create a feature branch: `git checkout -b feat/my-improvement`
2. Ensure all tests pass (`npm test`) and TypeScript compiles (`npm run build`).
3. Commit using conventional format.
4. Open a pull request against `main`.
