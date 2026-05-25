require('dotenv').config();

const express = require('express');
const oauthRouter = require('./src/routes/oauth');
const logsRouter = require('./src/routes/logs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // OAuth spec requires form-encoded support

app.use('/oauth', oauthRouter);
app.use('/logs', logsRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the on-prem API',
    auth: {
      endpoint: 'POST /oauth/token',
      grant_type: 'client_credentials',
      required_fields: ['client_id', 'client_secret', 'grant_type'],
    },
    protected_endpoints: ['GET /logs'],
  });
});

/* istanbul ignore next — entry-point block, not reachable in Jest */
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
}

module.exports = app;
