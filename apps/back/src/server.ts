import fastify, { type FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { verifyJWT } from "./decorators/auth";

const app: FastifyInstance = fastify({
  logger: true,
});

app.register(cors);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(require("@fastify/jwt"), { secret: "supersecret" });
app.decorate("verifyJWT", verifyJWT);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Corum API",
      description: "Corum backend service",
      version: "1.0.0",
    },
    servers: [],
    components: {
      securitySchemes: {
        authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ authorization: [] }],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/documentation",
});

export default app;
