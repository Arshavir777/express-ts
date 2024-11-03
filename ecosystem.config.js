module.exports = [
  {
    script: 'dist/server.js',
    name: 'api',
    exec_mode: 'cluster',
  },
  {
    script: 'dist/worker.js',
    name: 'worker',
  },
];
