// eslint.config.mjs
import antfu from "@antfu/eslint-config"

export default antfu({
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: "double",
  },
}, {
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
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
