import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createUserSchema } from "../modules/users/schema.js";
import { prisma } from "./utils/prisma.js";

const app = new Hono()
	.use(cors())
	.get("/users", async (c) => {
		const users = await prisma.user.findMany();
		return c.json({ users });
	})
	.post("/users", zValidator("json", createUserSchema), async (c) => {
		const body = c.req.valid("json");

		const newUser = await prisma.user.create({
			data: {
				name: body.name,
				email: body.email,
			},
		});

		return c.json({ user: newUser });
	});

// export api spesification
export type AppType = typeof app;

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
