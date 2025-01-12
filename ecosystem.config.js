module.exports = {
  apps: [
    {
      name: 'ver-praia-back-node-prod',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
