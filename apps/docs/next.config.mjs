import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  // Disable mermaid to avoid SSG issues with React hooks
  mdxOptions: {
    remarkPlugins: [],
  },
});

export default withNextra({
  output: "export",
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for Netlify
  trailingSlash: true,
  reactStrictMode: true,
});
