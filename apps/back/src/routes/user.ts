import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { users } from "../repositories";
import {
  createUserSchema,
  getUserParamsSchema,
  updateUserSchema,
} from "@corum/dto";
import { userSchema } from "@corum/dto";
import type { User } from "@corum/dto";
import { z } from "zod";
import { verifyJWT } from "../decorators/auth";

const userRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/users",
    preHandler: [verifyJWT],
    schema: {
      querystring: getUserParamsSchema,
      response: {
        200: userSchema.array(),
      },
    },
    handler: async (req, res) => {
      const result = await users.getUsers(req.query);

      res.send(result as User[]);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user",
    schema: {
      body: createUserSchema,
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    preHandler: [verifyJWT],
    handler: async (req, res) => {
      await users.createUser(req.body);

      res.send({ message: "User created" });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/user/:id",
    preHandler: [verifyJWT],
    schema: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      response: {
        200: userSchema,
      },
    },
    handler: async (req, res) => {
      const [result] = await users.getUser(req.params.id);

      res.send(result);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/user/:id",
    preHandler: [verifyJWT],
    schema: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      response: {
        200: z.object({
          id: z.number(),
        }),
      },
    },
    handler: async (req, res) => {
      await users.deleteUser(req.params.id);

      res.send({ id: req.params.id });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/user/:id",
    preHandler: [verifyJWT],
    schema: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: updateUserSchema,
      response: {
        200: z.object({
          id: z.number(),
        }),
      },
    },
    handler: async (req, res) => {
      await users.updateUser(req.params.id, req.body);

      res.send({ id: req.params.id });
    },
  });
};

export default userRoutes;
