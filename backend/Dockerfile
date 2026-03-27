FROM node:20-alpine

WORKDIR /app

# Copy package files separately for better caching
COPY package*.json ./

RUN npm install

# Copy the rest of the code
COPY . .

# Create logs directory for Winston
RUN mkdir -p logs

EXPOSE 5000

# Using dev script for local docker dev
CMD ["npm", "run", "dev"]
