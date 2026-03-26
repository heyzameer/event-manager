// src/config/index.js
const config = {
    apiUrl: import.meta.env.VITE_API_BASE_URL
};

if (!config.apiUrl) {
    console.error("CRITICAL: VITE_API_BASE_URL is missing in .env file.");
}

export default config;
