import nextPlugin from "@next/eslint-plugin-next";

export default [
    {
        ignores: [".next", "node_modules", "dist", "build", ".vercel"],
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "@next/next": nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            "@next/next/no-html-link-for-pages": "off",
            "@next/next/no-img-element": "warn",
            "react/no-unescaped-entities": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": [
                "warn",
                {
                    allow: ["warn", "error"],
                },
            ],
        },
    },
];
