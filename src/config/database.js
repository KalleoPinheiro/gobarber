require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.HOST,
  dialect: 'postgres',
  define: { timestamps: true, underscored: true, underscoredAll: true },
};
