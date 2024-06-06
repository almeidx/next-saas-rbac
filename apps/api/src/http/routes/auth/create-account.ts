import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "#lib/prisma.js";
import { hash } from "bcrypt";

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				summary: "Create a new account",
				tags: ["auth"],
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(8).max(128),
				}),
				response: {
					201: z.null({ description: "Account created" }),
					400: z.object({ message: z.string() }, { description: "Invalid request" }),
				},
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body;

			const existingUser = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (existingUser) {
				throw app.httpErrors.badRequest("Email already in use");
			}

			const [, domain] = email.split("@");

			const autoJoinOrg = await prisma.organization.findFirst({
				where: {
					domain,
					shouldAttachDomain: true,
				},
			});

			const passwordHash = await hash(password, 6);

			await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
					memberOn: autoJoinOrg ? { create: { organizationId: autoJoinOrg.id } } : undefined,
				},
			});

			reply.statusCode = 201;
		},
	);
}
