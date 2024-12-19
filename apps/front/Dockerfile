FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/front/package.json ./apps/front/
COPY packages/ ./packages/

WORKDIR /app/packages/dto

RUN bun link

WORKDIR /app

# Install dependencies
RUN bun install

# Copy source code
COPY apps/front/ ./apps/front/

# Build and run the application
CMD ["bun", "--filter", "front", "dev"]

EXPOSE 3000