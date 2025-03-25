# Base image
FROM node:20 

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY . .

# Install project dependencies
RUN corepack enable && pnpm install


# Expose the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "dev"]