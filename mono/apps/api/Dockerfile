# ----- STAGE 1: Install PNPM ----- #

# Use the official Node.js 16 image
FROM node:16-alpine AS base

# Arguments for PNPM version, default is 6.9.0
ARG PNPM_VERSION=6.9.0

# Install PNPM
RUN npm --no-update-notifier --no-fund --global install pnpm@${PNPM_VERSION}

# Workdir
WORKDIR /root/mono

# ----- STAGE 2: Install dependencies, build ----- #
FROM base AS dev

# Arguments for the package path to install dependencies
ARG PACKAGE_PATH 

# Set the environment variable to avoid installing dev dependencies in production
ENV CI=true
COPY ./meta .

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
    # By caching the content-addressable store, we can avoid re-installing dependencies
    pnpm install --filter "{${PACKAGE_PATH}}..."\
    # Install dev dependencies for the API in the mono repo
    # ... and any other dependencies that are not in the mono repo
    --frozen-lockfile\
    # Ensure the lockfile is up-to-date
    --unsafe-perm\
    # ↑ Docker runs pnpm as root and then pnpm won't run package scripts unless we pass this arg \
    | grep -v "cross-device link not permitted\|Falling back to copying packages from store" 
    # Docker's 'cache' mount type causes Docker to place the pnpm content-addressable store \
    # on a different virtual drive, which prohibits pnpm from symlinking its content to its virtual store \
    # (in node_modules/.pnpm), and that causes pnpm to fall back on copying the files. \
    # And that's fine!, except pnpm emits many warnings of this, so here we filter those out.

COPY ./deps .
RUN pnpm build --if-present --filter "{${PACKAGE_PATH}}..."
# ↑ Build dependencies separately, because they often change less often than the package itself

# ----- STAGE 3: Copy assets, remove source code ----- #
FROM dev AS assets
RUN rm -rf node_modules && pnpm recursive exec -- rm -rf ./src ./node_modules

# ----- STAGE 4: Production image ----- #
FROM base AS prod
ARG PACKAGE_PATH
ENV CI=true

# Copy the meta file to the image
COPY ./meta .

# Install production dependencies
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
    pnpm install --filter "{${PACKAGE_PATH}}..."\
    --frozen-lockfile\
    --production\
    --unsafe-perm\
    | grep -v  "cross-device link not permitted\|Falling back to copying packages from store"

COPY --from=assets /root/mono .

WORKDIR /root/mono/${PACKAGE_PATH}
EXPOSE ${API_PORT}
ENV NODE_ENV=${NODE_ENV}
ENTRYPOINT ["pnpm", "build:start"]
