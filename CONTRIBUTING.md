# Contributing to DittoPDF

Thank you for your interest in contributing to DittoPDF! We welcome contributions from everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue with the following information:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: How to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device information

### Suggesting Enhancements

For feature requests, please open an issue with:

- **Description**: Clear description of the feature
- **Use Case**: Why this feature would be useful
- **Examples**: Any relevant examples or mockups

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Commit your changes** with a clear commit message
7. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- PostgreSQL (for database)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dittopdf.git
cd dittopdf

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
npx prisma migrate dev
npx prisma generate

# Run the development server
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific tests
npm test -- --testPathPattern=test-file-name
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Coding Standards

### TypeScript

- Use strict typing wherever possible
- Avoid `any` type
- Use interfaces for complex types
- Follow consistent naming conventions

### React

- Use functional components with hooks
- Follow the component structure pattern
- Use TypeScript for all components
- Keep components small and focused

### CSS

- Use Tailwind CSS utility classes
- Follow the design system
- Keep styles consistent
- Use responsive design principles

### Git

- Use meaningful commit messages
- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Keep commits small and focused
- Use branches for features and bug fixes

### Commit Message Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Example**:
```
feat(auth): add Google OAuth integration

- Implement Google OAuth login
- Add Google OAuth configuration
- Update authentication flow
- Add error handling

Closes #123
```

## Branch Naming

- `feat/<feature-name>`: For new features
- `fix/<issue-name>`: For bug fixes
- `docs/<topic>`: For documentation updates
- `refactor/<component>`: For code refactoring
- `chore/<task>`: For maintenance tasks

## Pull Request Process

1. Ensure your code follows the coding standards
2. Update the documentation if needed
3. Add tests for new features
4. Make sure all tests pass
5. Update the CHANGELOG.md
6. Submit the pull request with a clear description
7. Wait for code review and address any feedback

## Code Review

All pull requests will be reviewed by the maintainers. We aim to review pull requests within 72 hours.

## License

By contributing to DittoPDF, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Support

If you need help with contributing, please:

- Check the [documentation](https://dittopdf.com/docs)
- Ask in our [community forum](https://dittopdf.com/community)
- Contact us at support@dittopdf.com

## Security

If you discover any security vulnerabilities, please email security@dittopdf.com instead of using the issue tracker.

## Acknowledgements

Thank you for contributing to DittoPDF! Your contributions help make this project better for everyone.