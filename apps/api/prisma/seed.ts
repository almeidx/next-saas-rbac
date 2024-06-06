import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

await prisma.organization.deleteMany();
await prisma.user.deleteMany();

const passwordHash = await hash("password", 6);

const [user, anotherUser, anotherUser2] = await prisma.user.createManyAndReturn({
	data: [
		{
			name: "John Doe",
			email: "john@acme.com",
			avatarUrl: "https://github.com/almeidx.png",
			passwordHash,
		},
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			passwordHash,
		},
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			passwordHash,
		},
	],
});

await prisma.organization.create({
	data: {
		name: "Acme Inc (Admin)",
		domain: "acme.com",
		slug: "acme-admin",
		avatarUrl: faker.image.avatarGitHub(),
		shouldAttachDomain: true,
		ownerId: user.id,

		projects: {
			createMany: {
				data: [
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
				],
			},
		},
		members: {
			createMany: {
				data: [
					{
						userId: user.id,
						role: "Admin",
					},
					{
						userId: anotherUser.id,
						role: "Member",
					},
					{
						userId: anotherUser2.id,
						role: "Member",
					},
				],
			},
		},
	},
});

await prisma.organization.create({
	data: {
		name: "Acme Inc (Member)",
		slug: "acme-member",
		avatarUrl: faker.image.avatarGitHub(),
		ownerId: user.id,

		projects: {
			createMany: {
				data: [
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
				],
			},
		},
		members: {
			createMany: {
				data: [
					{
						userId: user.id,
						role: "Member",
					},
					{
						userId: anotherUser.id,
						role: "Admin",
					},
					{
						userId: anotherUser2.id,
						role: "Member",
					},
				],
			},
		},
	},
});

await prisma.organization.create({
	data: {
		name: "Acme Inc (Billing)",
		slug: "acme-billing",
		avatarUrl: faker.image.avatarGitHub(),
		ownerId: user.id,

		projects: {
			createMany: {
				data: [
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(3),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
					},
				],
			},
		},
		members: {
			createMany: {
				data: [
					{
						userId: user.id,
						role: "Billing",
					},
					{
						userId: anotherUser.id,
						role: "Admin",
					},
					{
						userId: anotherUser2.id,
						role: "Member",
					},
				],
			},
		},
	},
});

console.log("Database seeded");
