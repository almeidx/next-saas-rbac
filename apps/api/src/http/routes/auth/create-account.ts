import type { FastifyInstance } from "fastify";
import type { ValibotTypeProvider } from "fastify-type-provider-valibot";
import { email, maxLength, minLength, object, pipe, string } from "valibot";

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ValibotTypeProvider>().post(
		"/users",
		{
			schema: {
				body: object({
					name: string(),
					email: pipe(string(), email()),
					password: pipe(string(), minLength(8), maxLength(128)),
				}),
			},
		},
		() => {
			return "User created";
		},
	);
}
