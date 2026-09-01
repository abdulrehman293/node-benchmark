const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:@localhost:5432/postgres',
  max: 20
});

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM products LIMIT 10');
      client.release();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.rows));
} catch (err) {
  console.error('PostgreSQL Connection Error:', err); // <-- Add this line
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Database query failed' }));
}
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Node.js server listening on port ${PORT}`);
});