export interface EnvVars {
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ متغير البيئة ${name} غير موجود.`);
  }
  return value;
}

let validated = false;
let envCache: EnvVars | null = null;

export function validateEnv(): EnvVars {
  if (validated && envCache) return envCache;

  const vars: EnvVars = {
    DATABASE_URL: requireEnv("DATABASE_URL"),
    NEXTAUTH_SECRET: requireEnv("NEXTAUTH_SECRET"),
    NEXTAUTH_URL: requireEnv("NEXTAUTH_URL"),
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };

  validated = true;
  envCache = vars;
  return vars;
}

export function getEnv(): EnvVars {
  if (!validated) {
    return validateEnv();
  }
  return envCache!;
}
