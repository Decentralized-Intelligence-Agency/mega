module.exports = {
  apps: [
    {
      script: "./src/index.js",
      watch: ["src"],
      watch_delay: 100,
      ignore_watch: ["node_modules"],
    },
  ],
};
