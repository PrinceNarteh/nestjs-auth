.PHONY: drizzle-generate
drizzle-generate:
	@pnpm drizzle-kit generate

.PHONE: drizzle-migrate
drizzle-migrate:
	@pnpm drizzle-kit migrate
