import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "#lib/prisma.js";
import { compare } from "bcrypt";

export async function authenticateWithPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sessions/password",
		{
			schema: {
				summary: "Authenticate with email and password",
				tags: ["auth"],
				body: z.object({
					email: z.string().email(),
					password: z.string().min(8).max(128),
				}),
				response: {
					201: z.object({ token: z.string() }, { description: "Authentication successful" }),
					400: z.object({ message: z.string() }, { description: "Invalid credentials" }),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const userFromEmail = await prisma.user.findUnique({
				where: {
					email,
				},
				select: {
					id: true,
					passwordHash: true,
				},
			});

			if (!userFromEmail) {
				throw app.httpErrors.unauthorized("Invalid credentials");
			}

			if (userFromEmail.passwordHash === null) {
				throw app.httpErrors.unauthorized("This user uses a social login");
			}

			const passwordMatches = await compare(password, userFromEmail.passwordHash);

			if (!passwordMatches) {
				throw app.httpErrors.unauthorized("Invalid credentials");
			}

			const token = await reply.jwtSign(
				{
					sub: userFromEmail.id,
				},
				{
					sign: {
						expiresIn: "7d",
					},
				},
			);

			reply.statusCode = 201;

			return { token };
		},
	);
}
