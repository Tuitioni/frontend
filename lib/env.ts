function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export const env = {
  get TUITIONI_API() {
    return getRequiredEnvVar('TUITIONI_API');
  },
} as const;
