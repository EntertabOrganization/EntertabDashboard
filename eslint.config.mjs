import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // Too strict for common client-fetch-on-mount hydration patterns (Next/React 19).
      "react-hooks/set-state-in-effect": "off"
    }
  }
];


export default config;
