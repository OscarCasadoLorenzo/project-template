# Contributing

First off, thanks for taking the time to contribute ❤!

Project Template is in early development (prototyping) stage, the codebase hasn't been optimized yet. It is gradually being refactored, changing and breaking some things, so you might encounter code conflicts.

## Reporting Guidelines

### 🐞 Reporting Bugs or Problems

If you've identified a bug, encountered an issue, or stumbled upon a problem, we appreciate your diligence in bringing it to our attention. Before diving into the fix, please create an issue detailing the problem. This allows for discussion, collaboration, and ensures that efforts are coordinated.

#### How to Report a Bug:

- Go to the [Issues](https://github.com/OscarCasadoLorenzo/project-template/issues) section.
- Click on `New Issue`
- Provide a detailed description, steps to reproduce, and any relevant information.

### 💡 Proposing Ideas or Enhancements

Have a brilliant idea or an enhancement suggestion? Fantastic! Let's discuss it first to align with the project's goals and ensure it's the right fit. Share your thoughts by creating an issue and initiating a conversation.

#### How to Propose an Idea:

- Navigate to the [Issues](https://github.com/OscarCasadoLorenzo/project-template/issues) section.
- Click on `New Issue`
- Select the `Feature Request` template.
- Clearly outline your idea, its benefits, and any potential challenges.

## How to contribute

If you want to implement some changes into this project check the next steps for it:

### Issues, Branches & Pull requests

#### ⚠ Before contributing

Create a new issue or a discussion and describe the feature / fix / changes you want to implement so we can discuss it first.

1. **Fork the repository**

   In the upper right corner of the [repository main page](https://github.com/OscarCasadoLorenzo/project-template), find the `Fork` button. Click on it to create your own copy of the repository under your GitHub account.

2. **Clone your fork locally**

   ```bash
   git clone https://github.com/<your-username>/project-template.git
   cd project-template
   ```

3. **Create a new branch following GitFlow naming conventions**

   Branch names must follow the GitFlow pattern with the project identifier and issue number:
   - **Feature branches**: `feature/SPM-<issue-number>`
     ```bash
     git checkout -b feature/SPM-123
     ```
   - **Bugfix branches**: `bugfix/SPM-<issue-number>`
     ```bash
     git checkout -b bugfix/SPM-45
     ```
   - **Hotfix branches**: `hotfix/SPM-<issue-number>`
     ```bash
     git checkout -b hotfix/SPM-9
     ```

   Replace `<issue-number>` with the actual GitHub issue number (e.g., if the issue is #123, use `SPM-123`).

   **Important**: This naming convention is required for automated commit message prefixing. All commits in your branch will automatically be prefixed with the issue identifier (e.g., `SPM-123`).

4. **Implement your changes**

   This repository follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

   **Commit Message Format**:

   ```
   SPM-<issue-number> <type>: <concise summary>

   - Detailed description of what changed
   - Additional context about the change

   Context:
   Explanation of why this change was made and what problem it solves.
   ```

   **Conventional Commit Types**:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `refactor`: Code refactoring
   - `test`: Adding tests
   - `chore`: Maintenance tasks
   - `style`: Code style changes (formatting, etc.)
   - `perf`: Performance improvements

   **Example Commit**:

   ```
   SPM-123 feat: add character creation form

   - Added CharacterForm component with validation
   - Integrated with TanStack Query for API calls
   - Added form field components from shadcn/ui

   Context:
   This enables users to create new characters with proper validation,
   addressing the need for a streamlined character creation workflow.
   ```

5. **Create and submit the Pull Request**

   Visit your forked repository on GitHub. Click on the `Pull Requests` tab, then the `New Pull Request` button. GitHub will guide you through the process of creating a pull request to the original repository.  
   📑Do not forget to link the associated issue, for example: "Closes #1234"

6. **Enjoy your work 😎**  
   When a Pull Request is merged into develop branch you will be added in <u>contributors list</u>.

## 📚 Additional Resources

- [Project Template Kanban Board](https://github.com/users/OscarCasadoLorenzo/projects/18)
