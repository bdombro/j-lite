#!/usr/bin/env bash
# Resolve version (explicit tag or patch|minor|major from GitHub latest), zip dist/, create gh release.
# GitHub target: repo inferred from branch.<current>.remote (falls back to origin), not gh's default alone.
# Run from repo root after `just build` (or via `just release …`).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Target the GitHub repo for this branch's configured remote (not only origin).
branch="$(git branch --show-current 2>/dev/null || true)"
[[ -z "${branch}" ]] && {
  echo "release.sh: detached HEAD; checkout a branch first." >&2
  exit 1
}
remote="$(git config --get "branch.${branch}.remote" || true)"
[[ -z "${remote}" ]] && remote="origin"
url="$(git remote get-url "${remote}" 2>/dev/null)" || {
  echo "release.sh: could not read URL for remote '${remote}'." >&2
  exit 1
}
url="${url%.git}"
gh_host=""
gh_repo=""
if [[ "$url" =~ ^git@([^:]+):(.+)$ ]]; then
  gh_host="${BASH_REMATCH[1]}"
  gh_repo="${BASH_REMATCH[2]}"
elif [[ "$url" =~ ^https?:// ]]; then
  rest="${url#*://}"
  rest="${rest#*@}"
  gh_host="${rest%%/*}"
  gh_repo="${rest#*/}"
  gh_repo="${gh_repo%%\?*}"
fi
[[ -z "${gh_repo}" ]] && {
  echo "release.sh: cannot parse GitHub owner/repo from remote '${remote}': ${url}" >&2
  exit 1
}
if [[ "$gh_host" == "github.com" || "$gh_host" == "ssh.github.com" ]]; then
  unset GH_HOST
else
  export GH_HOST="${gh_host}"
fi
export GH_REPO="${gh_repo}"
echo "release.sh: GitHub repo ${GH_REPO}${GH_HOST:+ (${GH_HOST})} (git remote: ${remote})" >&2

ver_raw="${1:?usage: release.sh <version | patch | minor | major>}"

case "$ver_raw" in
  patch|minor|major)
    bump="$ver_raw"
    repo="${GH_REPO}"
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
