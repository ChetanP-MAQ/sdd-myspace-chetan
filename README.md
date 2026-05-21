# MySpace Portal

A comprehensive employee management and leave request system designed to streamline HR operations and employee self-service capabilities.

## Overview

The MySpace Portal is a modern web application that provides:
- Employee profile management
- Leave request and approval workflows
- Attendance tracking
- Team management
- HR analytics and reporting

## Project Constitution

This project adheres to five core principles:

1. **Identity & Auth** - Single authoritative identity source with centralized access control
2. **Time** - All timestamps in UTC for consistency and cross-region reliability
3. **PII** - Personal information redacted from all logs for privacy protection
4. **Secrets** - Sensitive data managed through environment variables and secure vaults
5. **Observability** - All write operations logged with actor, action, and entity tracking

See [Project Constitution](./memory/constitution.md) for detailed governance rules.

## Getting Started

### Prerequisites
- Node.js v24.15.0 or higher
- Python 3.11.9 or higher
- Git 2.54.0 or higher
- `uv` package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/ChetanP-MAQ/sdd-myspace-chetan.git
cd sdd-myspace-chetan

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
.
├── .github/              # GitHub workflows and configurations
├── .specify/             # SpecKit project templates and extensions
├── memory/               # Project documentation and constitution
├── specs/                # Feature specifications
├── .vscode/              # VS Code workspace settings
└── SDD_S1_HANDS_ON_GUIDE.md  # Development guide
```

## Development Workflow

This project uses SpecKit for feature specification and implementation planning:

1. **Specify** - Define feature requirements
2. **Plan** - Create implementation design
3. **Tasks** - Generate actionable task list
4. **Implement** - Execute tasks in dependency order
5. **Analyze** - Validate consistency and quality

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following the project constitution
3. Commit with clear messages: `git commit -m "type: description"`
4. Push and create a pull request: `git push -u origin feature/your-feature`
5. Ensure all tests pass and code is reviewed

## Code Style

- Prettier for formatting
- Format on save is enabled in VS Code
- Editor rulers at 80 and 120 characters
- See `.vscode/settings.json` for detailed configuration

## License

This project is proprietary and confidential.

## Support

For issues or questions, please contact the development team.

---

**Last Updated**: May 21, 2026
