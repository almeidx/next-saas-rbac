import { fastify } from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { createAccount } from "./routes/auth/create-account.js";
import fastifySensible from "@fastify/sensible";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password.js";
import fastifyJwt from "@fastify/jwt";
import { getProfile } from "./routes/auth/get-profile.js";
import { requestPasswordRecover } from "./routes/auth/request-password-recover.js";

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

await app.register(fastifySensible);

await app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Next.js SaaS",
			description: "Full-stack SaaS app with multi-tenancy & RBAC",
			version: "1.0.0",
		},
		servers: [],
	},
	transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
	routePrefix: "/docs",
});

await app.register(fastifyJwt, {
	secret: "supersecretkey",
});

app.decorateRequest("getCurrentUserId", async function () {
	try {
		const { sub } = (await this.jwtVerify()) as { sub: string };
		return sub;
	} catch {
		throw app.httpErrors.unauthorized("Invalid token");
	}
});

declare module "fastify" {
	interface FastifyRequest {
		getCurrentUserId(): Promise<string>;
	}
}

await app.register(createAccount);
await app.register(authenticateWithPassword);
await app.register(getProfile);
await app.register(requestPasswordRecover);

await app.listen({ port: 3000 });

console.log("Server listening on port 3000");
