##### MyBoothManager #####
### BUILD STAGE ###
# Use Node.js LTS Alpine image as build environment
FROM node:lts-alpine AS build
# Set working directory
WORKDIR /app
# Copy ALL files to image
COPY . .
# Run first install script
RUN yarn pre
# Install dependencies (for make sure)
RUN yarn install
# Build all
RUN yarn all:build

### PRODUCTION STAGE ###
# Use Node.js LTS Alpine image as production environment
FROM node:lts-alpine AS production
# Set working directory
WORKDIR /app
# Copy built files from build stage
COPY --from=build /app/projects/Admin/dist ./admin
COPY --from=build /app/projects/Backend/dist ./backend
