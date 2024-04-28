/* eslint-disable */

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
  webpack: (config) => {
    // Load SVGs as React components
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });
    // Appears necessary with PDFJS 3.x (and we are avoided 4.x for now due to strange issues, see pdf-reading.ts)
    config.externals.push({ canvas: "commonjs canvas" })
    return config;
  }
};

export default config;
