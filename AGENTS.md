# AI Agent Configuration

This document provides a centralized reference to all AI agent rules, context, and prompts used in this project. These guidelines ensure consistent, high-quality assistance from AI coding assistants.

## 📋 Overview

**All rules defined in the `.ai/` folder must be followed at all times.** If conflicts arise between rules or new requirements emerge, always ask the user for clarification on the best resolution approach.

---

## 📁 Configuration Structure

The `.ai/` folder contains three main categories:

### 🎯 Context Files (`.ai/context/`)

Provide project-specific background and domain knowledge.

- **`project.md`** - High-level project overview, goals, and architecture summary for AI agents to understand the Project Template application context.

### 🤖 Prompt Files (`.ai/prompts/`)

Define specific workflows and automated tasks.

- **`commit-changes.md`** - Autonomous Git commit workflow using Conventional Commits with GitFlow branch naming (e.g., `feature/SPM-123`), including automated change detection, grouping, and commit message generation with detailed context.

### 📏 Rules Files (`.ai/rules/`)

Establish coding standards and best practices.

- **`architecture.md`** - Monorepo structure guidelines, module organization, dependency management, and separation of concerns for the Turborepo-based Next.js + NestJS architecture.

- **`security.md`** - Security best practices including authentication, authorization, input validation, environment variable handling, and protection against common vulnerabilities.

- **`style.md`** - Code style conventions for TypeScript, React, NestJS, naming conventions, file organization, and formatting standards across the monorepo.

- **`testing.md`** - Testing requirements, strategies, and patterns for unit tests, integration tests, E2E tests, and coverage expectations.

- **`frontend.md`** - MUST: Frontend development guidelines and best practices

- **`backend.md`** - MUST: Frontend development guidelines and best practices

---

## 🚨 Conflict Resolution

**When conflicts occur:**

1. **Between rules in different files**: Ask the user which rule takes precedence for the specific scenario.
2. **Between existing rules and new requirements**: Present both options and request user guidance.
3. **Between AI interpretation and user intent**: Always defer to explicit user instructions.

**Never make assumptions** when rules conflict. Clarity ensures maintainability.

---

## 🔄 Rule Priority

In general, follow this priority order:

1. **Explicit user instructions** (highest priority)
2. **Security rules** (`security.md`) - Never compromise security
3. **Architecture rules** (`architecture.md`) - Maintain structural integrity
4. **Testing rules** (`testing.md`) - Ensure code quality
5. **Style rules** (`style.md`) - Maintain consistency

However, **always consult the user** if uncertainty arises.

---

## 📚 Usage Guidelines

### For AI Agents

- Read all files in `.ai/` before starting work on this project
- Reference specific rules when making architectural or style decisions
- Follow the commit workflow defined in `commit-changes.md` for all Git operations
- Cite the relevant rule file when explaining decisions (e.g., "Per `architecture.md`, modules should...")

### For Developers

- Review `.ai/rules/` to understand project standards
- Update rule files when team decisions change coding practices
- Keep `project.md` current as the application evolves
- Ensure new prompts follow the same structured format

---

## 🔗 Integration

This `AGENTS.md` file is referenced in:

- `.copilot/copilot_instructions.md` - For GitHub Copilot integration
- Other IDE-specific AI assistant configurations

**Note:** Not all IDEs support the `.ai/` folder natively. This centralized reference ensures consistency across different development environments.

---

## 📝 Maintenance

When updating AI configuration:

1. ✅ Update the relevant file in `.ai/context/`, `.ai/prompts/`, or `.ai/rules/`
2. ✅ Update this `AGENTS.md` file if the summary changes
3. ✅ Communicate changes to the development team
4. ✅ Ensure AI agents re-read configurations before next session

---

**Last Updated:** November 14, 2025
