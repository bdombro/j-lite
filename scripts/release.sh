#!/usr/bin/env bash
# Resolve version (explicit tag or patch|minor|major from GitHub latest), zip dist/, create gh release.
# Run from repo root after `just build` (or via `just release …`).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ver_raw="${1:?usage: release.sh <version | patch | minor | major>}"

case "$ver_raw" in
  patch|minor|major)
    bump="$ver_raw"
    repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
    latest="$(gh api "repos/${repo}/releases/latest" --jq .tag_name 2>/dev/null || true)"
    if [[ -z "${latest:-}" ]]; then
      case "$bump" in
        patch) ver="v0.0.1" ;;
        minor) ver="v0.1.0" ;;
        major) ver="v1.0.0" ;;
      esac
      echo "No GitHub latest release; using ${ver}" >&2
    else
      t="${latest#v}"
      if [[ "${t}" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+) ]]; then
        major="${BASH_REMATCH[1]}"
        minor="${BASH_REMATCH[2]}"
        patch="${BASH_REMATCH[3]}"
        case "$bump" in
          patch)
            ver="v${major}.${minor}.$((10#${patch} + 1))"
            echo "Bumped patch: ${latest} -> ${ver}" >&2
            ;;
          minor)
            ver="v${major}.$((10#${minor} + 1)).0"
            echo "Bumped minor: ${latest} -> ${ver}" >&2
            ;;
          major)
            ver="v$((10#${major} + 1)).0.0"
            echo "Bumped major: ${latest} -> ${ver}" >&2
            ;;
        esac
      else
        echo "Latest release tag '${latest}' is not major.minor.patch; pass an explicit version." >&2
        exit 1
      fi
    fi
    ;;
  *)
    ver="$ver_raw"
    [[ "$ver" =~ ^v ]] || ver="v$ver"
    ;;
esac

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
(cd dist && zip -qr "$tmp/j-lite-${ver}.zip" .)
gh release create "$ver" "$tmp/j-lite-${ver}.zip" --generate-notes
