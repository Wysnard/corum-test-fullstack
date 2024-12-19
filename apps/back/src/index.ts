import app from "./server";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

app.get("/ping", async (request, reply) => {
  return "pong\n";
});

app.after(() => {
  app.register(authRoutes);
  app.register(userRoutes);
});

async function run() {
  await app.ready();

  app.listen({ host: "0.0.0.0", port: 8080 }, async (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    console.log(`Documentation running at ${address}/documentation`);
  });
}

run();
