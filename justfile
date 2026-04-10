# J-Lite — task runner (https://github.com/casey/just)
# Run `just` with no arguments to show `just --help`.

export PATH := justfile_directory() + "/node_modules/.bin:" + env_var_or_default("PATH", "")

default:
    @just --help

# --- App ---

# Dev server (Vite)
start:
    vite

# Production build
build:
    vite build
    printf '\nbody {visibility:hidden}' >> dist/main.css

# Preview production build
preview:
    vite preview

# --- Storybook ---

storybook:
    storybook dev -p 6006

build-storybook:
    storybook build

# --- Quality ---

test:
    vitest run

lint:
    tsc
    eslint . --cache --cache-location=node_modules/.eslintcache
    prettier --check .

alias fmt := format
format:
    prettier --cache -w .

# --- Maintenance ---

clean:
    rm -rf dist

install:
    npm i

update:
    npx npm-check-updates

# Watch src and rebuild on change
build-watch:
    npx nodemon --watch src -e js,jsx,ts,tsx,css --exec 'just build'

# Lint on file change
lint-watch:
    npx nodemon -e js,jsx,ts,tsx,css --exec 'just lint'


# --- Release ---

# Build, zip dist/ (Chrome-loadable root), and create a GitHub release for this commit.
# Requires: gh CLI (https://cli.github.com/) authenticated for the repo.
# Usage: just release 1.2.3 | just release v1.2.3 | just release patch|minor|major
#   See scripts/release.sh for bump semantics and defaults when no prior release exists.
release version: clean lint test build
    ./scripts/release.sh "{{version}}"
