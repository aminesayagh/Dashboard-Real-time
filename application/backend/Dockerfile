FROM node:slim

ENV NODE_ENV development
ENV PORT 3001

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001
CMD [ "npm", "run", "dev" ]

# Exposing server port