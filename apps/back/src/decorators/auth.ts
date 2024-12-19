import type { FastifyReply, FastifyRequest } from "fastify";
import type { CustomRequest } from "../type";
import { loginUser } from "../repositories/user.repository";
import app from "../server";

export function verifyJWT(
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void
) {
  const req = request as CustomRequest;
  const jwt = app.jwt;

  if (req.body && req.body.failureWithReply) {
    reply.code(401).send({ error: "Unauthorized" });
    return done(new Error());
  }

  if (!request.raw.headers["authorization"]) {
    return done(new Error("Missing token header"));
  }

  const token = request.raw.headers["authorization"].split(" ")[1];

  if (!token) {
    return done(new Error("Missing token header"));
  }

  jwt.verify(token, onVerify);

  function onVerify(
    err: Error | null,
    decoded: { id: string; password: string }
  ) {
    if (err || !decoded.id || !decoded.password) {
      return done(new Error("Token not valid"));
    }

    const user = loginUser(decoded.id, decoded.password);

    if (!user) {
      return done(new Error("Token not valid"));
    }

    done();
  }
}
