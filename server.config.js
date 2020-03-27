module.exports = {
  apps : [
    {
      name: "Synergy",
      script: "./server",
      watch: false,
      instances : "max",
      exec_mode : "cluster",
      env: {
        "PORT": 3000,
        "URL": "http://localhost:4200",
        "NODE_ENV": "development"
      },
      env_production: {
        "PORT": 3000,
        "URL": "http://localhost:3000",
        "NODE_ENV": "production"
      },
    }
  ]
};
