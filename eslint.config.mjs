// eslint.config.mjs
import antfu from "@antfu/eslint-config"

export default antfu({
  ignores: [
    ".agents/**",
    ".claude/**",
    ".codex/**",
    "skills-lock.json",
  ],
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: "double",
  },
}, {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["./*.js"],
        defaultProject: "tsconfig.json",
      },
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "ts/consistent-type-definitions": ["error", "type"],
    "ts/no-floating-promises": "error",
  },
}, {
  rules: {
    "no-console": ["warn"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: [
        /^README.*\.md$/,
      ],
    }],
  },
})
