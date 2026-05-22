export const config = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  nextAuthUrl: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? '',
};

if (!config.databaseUrl) {
  console.warn('Missing DATABASE_URL environment variable.');
}
