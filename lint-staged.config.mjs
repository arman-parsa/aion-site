const config = {
  "*.{js,jsx,mjs,cjs,ts,tsx}": ["prettier --write", "eslint --fix --max-warnings=0"],
  "*.{json,md,css,yml,yaml}": ["prettier --write"],
};

export default config;
