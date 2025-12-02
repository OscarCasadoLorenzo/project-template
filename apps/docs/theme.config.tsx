import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: "bold" }}>📚 Project Template Docs</span>,
  project: {
    link: "https://github.com/OscarCasadoLorenzo/project-template",
  },
  docsRepositoryBase:
    "https://github.com/OscarCasadoLorenzo/project-template/tree/main/apps/docs",
  footer: {
    content: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a
          href="https://github.com/OscarCasadoLorenzo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Project Template
        </a>
      </span>
    ),
  },
  search: {
    placeholder: "Search documentation...",
  },
  editLink: {
    content: "Edit this page on GitHub →",
  },
  feedback: {
    content: "Question? Give us feedback →",
    labels: "feedback",
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
};

export default config;
