export default {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },
};
