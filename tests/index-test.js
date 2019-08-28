const { resolve } = require("path");
const tape = require("tape");
const got = require("got");
const { StaticServer } = require("../dist");

tape("basic", async (t) => {
  // Create and start server
  const server = new StaticServer(resolve(__dirname, "fixtures"));
  server.listen(8088);

  // Fetch test document
  const response = await got("http://localhost:8088/test.txt");

  // Ensure test document contents are expected
  t.equal(response.body, "foobarbaz\n");

  // Cleanup
  server.stop();
  t.end();
});
