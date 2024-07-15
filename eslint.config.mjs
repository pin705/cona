import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
  ],
  rules: {
    noImplicitAny: "off",
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
