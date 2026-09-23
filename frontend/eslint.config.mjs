import nextConfig from "eslint-config-next";

const eslintConfig = [
    ...nextConfig,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/purity": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/static-components": "warn",
            "react-hooks/refs": "warn",
        },
    },
];

export default eslintConfig;

