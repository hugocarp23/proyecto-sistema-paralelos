FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN chmod +x node_modules/.bin/prisma
RUN chmod +x node_modules/.bin/tsx
RUN chmod +x node_modules/.bin/tsc

RUN npx prisma generate
RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --include=dev

RUN chmod +x node_modules/.bin/prisma
RUN chmod +x node_modules/.bin/tsx

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/server.js"]
