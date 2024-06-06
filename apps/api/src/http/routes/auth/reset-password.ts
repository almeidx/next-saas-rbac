import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "#lib/prisma.js";
import { hash, hashSync } from "bcrypt";

export async function resetPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/password/reset",
		{
			schema: {
				summary: "Reset password",
				tags: ["auth"],
				body: z.object({
					code: z.string().uuid(),
					password: z.string().min(8).max(128),
				}),
				response: {
					204: z.null({ description: "Password reset" }),
				},
			},
		},
		async (request, reply) => {
			const { code, password } = request.body;

			const tokenFromCode = await prisma.token.findUnique({
				where: {
					id: code,
				},
			});

			if (!tokenFromCode) {
				throw app.httpErrors.badRequest("Invalid code");
			}

			const passwordHash = await hash(password, 6);

			await prisma.user.update({
				where: {
					id: tokenFromCode.userId,
				},
				data: {
					passwordHash,
				},
			});

			await prisma.token.delete({
				where: {
					id: code,
				},
			});

			reply.statusCode = 204;
		},
	);
}
