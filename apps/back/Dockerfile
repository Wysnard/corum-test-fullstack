FROM oven/bun

WORKDIR /app

# Copy all source code first (including workspace packages)
COPY package.json ./
COPY apps/back/package.json ./apps/back/
COPY packages/ ./packages/

WORKDIR /app/packages/dto

RUN bun link

WORKDIR /app

# Install dependencies after all files are available
RUN bun install

COPY . .

CMD ["bun", "--filter", "back", "dev"]

EXPOSE 8080