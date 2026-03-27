FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite default dev port
CMD ["npm", "run", "dev", "--", "--host"]
