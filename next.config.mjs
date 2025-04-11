/** @type {import('next').NextConfig} */
const baseConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default async function getConfig() {
  let userConfig = {};

  try {
    // Try to import ESM config
    const esmConfig = await import('./v0-user-next.config.mjs');
    userConfig = esmConfig.default || esmConfig;
  } catch {
    try {
      // Fallback to CommonJS config
      const cjsConfig = await import('./v0-user-next.config.js');
      userConfig = cjsConfig.default || cjsConfig;
    } catch {
      // Ignore if neither config is found
    }
  }

  // Merge user config into base config
  for (const key in userConfig) {
    if (
      typeof baseConfig[key] === 'object' &&
      !Array.isArray(baseConfig[key])
    ) {
      baseConfig[key] = {
        ...baseConfig[key],
        ...userConfig[key],
      };
    } else {
      baseConfig[key] = userConfig[key];
    }
  }

  return baseConfig;
}
