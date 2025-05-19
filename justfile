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
# Usage: just release 1.2.3   or   just release v1.2.3
release version: clean lint test build
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{justfile_directory()}}"
    ver="{{version}}"
    [[ "$ver" =~ ^v ]] || ver="v$ver"
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    (cd dist && zip -qr "$tmp/j-lite-${ver}.zip" .)
    gh release create "$ver" "$tmp/j-lite-${ver}.zip" --generate-notes
