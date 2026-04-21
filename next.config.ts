import type { NextConfig } from "next"
import { execSync } from "child_process"

function gitInfo() {
  try {
    return {
      commit: execSync("git rev-parse --short HEAD").toString().trim(),
      date: execSync("git log -1 --format=%ci").toString().trim(),
    }
  } catch {
    return { commit: "dev", date: new Date().toISOString() }
  }
}

const { commit, date } = gitInfo()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  env: {
    BUILD_COMMIT: commit,
    BUILD_DATE: date,
  },
}

export default nextConfig
