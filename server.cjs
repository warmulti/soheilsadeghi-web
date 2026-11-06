/**
 * Startup file for cPanel "Setup Node.js App" (Phusion Passenger / LiteSpeed lsnode).
 * Set "Application startup file" to: server.cjs
 *
 * Passenger gives the app a PORT (or a socket) through process.env.PORT; locally it falls back to 3000.
 * Environment variables come from the cPanel app settings (and .env files, if present).
 */
process.env.NODE_ENV = "production";

const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`DJ Soheil site ready on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start the site:", err);
    process.exit(1);
  });
