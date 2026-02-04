FROM node:20-alpine AS ui-build

WORKDIR /app/ui
COPY ui/package.json ui/package-lock.json* ./
RUN npm install
COPY ui/ ./
RUN npm run build

FROM node:20-alpine AS final

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production

COPY api/ ./api/

COPY --from=ui-build /app/ui/dist ./ui/dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "api/app.js"]