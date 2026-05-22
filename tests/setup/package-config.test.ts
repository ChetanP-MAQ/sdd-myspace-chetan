import fs from 'node:fs';
import path from 'node:path';

describe('Package and environment configuration', () => {
  const root = path.resolve(__dirname, '../../');
  const packageJsonPath = path.join(root, 'package.json');
  const envExamplePath = path.join(root, '.env.example');

  test('package.json includes Prisma and Postgres dependencies', () => {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    expect(pkg.dependencies['@prisma/client']).toBeDefined();
    expect(pkg.dependencies['pg']).toBeDefined();
    expect(pkg.devDependencies.prisma).toBeDefined();
  });

  test('package.json includes linting and formatting configuration', () => {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    expect(pkg.eslintConfig).toBeDefined();
    expect(pkg.eslintConfig.extends).toContain('next/core-web-vitals');
    expect(pkg.prettier).toBeDefined();
    expect(pkg.prettier.singleQuote).toBe(true);
  });

  test('.env.example exists and defines a DATABASE_URL placeholder', () => {
    expect(fs.existsSync(envExamplePath)).toBe(true);
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    expect(envExampleContent).toContain('DATABASE_URL=');
    expect(envExampleContent).toContain('NEXTAUTH_SECRET');
  });
});
