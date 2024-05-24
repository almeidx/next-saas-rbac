import { fastify } from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { createAccount } from "./routes/auth/create-account.js";
import fastifySensible from "@fastify/sensible";

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

await app.register(fastifySensible);

await app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "SampleApi",
			description: "Sample backend service",
			version: "1.0.0",
		},
		servers: [],
	},
	transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
	routePrefix: "/docs",
});

await app.register(createAccount);

await app.listen({ port: 3000 });

console.log("Server listening on port 3000");
