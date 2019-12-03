module.exports = {
  local: {
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: { timestamps: true, underscored: true, underscoredAll: true },
  },
  development: {
    username: 'postgres',
    password: 'docker',
    database: 'gobarber_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: { timestamps: true, underscored: true, underscoredAll: true },
  },
  test: {
    username: 'postgres',
    password: 'docker',
    database: 'gobarber_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: { timestamps: true, underscored: true, underscoredAll: true },
  },
  production: {
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    host: '127.0.0.1',
    dialect: 'postgres_prod',
    define: { timestamps: true, underscored: true, underscoredAll: true },
  },
};
