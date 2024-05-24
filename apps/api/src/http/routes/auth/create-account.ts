import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "#lib/prisma.js";
import { hash } from "bcrypt";

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(8).max(128),
				}),
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body;

			const existingUser = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (existingUser) {
				throw app.httpErrors.badRequest("Email already in use");
			}

			const passwordHash = await hash(password, 6);

			await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
				},
			});

			reply.statusCode = 201;
		},
	);
}
