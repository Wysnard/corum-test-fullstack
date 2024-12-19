import type { FastifyRequest } from "fastify";
import type { FastifyJWT } from "@fastify/jwt";

export type CustomRequest = FastifyRequest<{
  jwt: FastifyJWT;
  Body: { failureWithReply: boolean };
}>;
