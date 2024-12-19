import { createUserSchema, loginUserSchema } from "@corum/dto";
import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { users } from "../repositories";
import { verifyJWT } from "../decorators/auth";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    schema: {
      body: loginUserSchema,
      response: {
        200: z.object({
          token: z.string(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: async (req, res) => {
      const [result] = await users.loginUser(req.body.email, req.body.password);

      console.log(result);

      if (!result) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      res.send({
        token: app.jwt.sign({ id: result.id, password: result.password }),
      });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/verify",
    schema: {
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    preHandler: [verifyJWT],
    handler: async (req, res) => {
      res.send({
        message: "ok",
      });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/register",
    schema: {
      body: createUserSchema,
    },
    handler: async (req, res) => {
      const result = await users.createUser(req.body);
      res.send(result);
    },
  });
};

export default authRoutes;
