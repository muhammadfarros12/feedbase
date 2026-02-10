import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prisma } from "./utils/prisma.js";

const app = new Hono();

app.get("/", async (c) => {
	await prisma.user.findMany()
	
	return c.text("Hello Hono!");
});

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
