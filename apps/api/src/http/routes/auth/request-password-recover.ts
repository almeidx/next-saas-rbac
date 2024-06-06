import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "#lib/prisma.js";

export async function requestPasswordRecover(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/password/recover",
		{
			schema: {
				summary: "Request password recovery",
				tags: ["auth"],
				body: z.object({
					email: z.string().email(),
				}),
				response: {
					204: z.null({ description: "Email sent" }),
				},
			},
		},
		async (request, reply) => {
			const { email } = request.body;

			const userFromEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!userFromEmail) {
				// Return 204 to prevent user enumeration
				reply.statusCode = 204;
				return;
			}

			const { id: code } = await prisma.token.create({
				data: {
					type: "PasswordRecover",
					userId: userFromEmail.id,
				},
			});

			console.log(`Password recovery code for ${email}: ${code}`);

			reply.statusCode = 204;
		},
	);
}
