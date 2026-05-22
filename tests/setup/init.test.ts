import fs from 'node:fs';
import path from 'node:path';

describe('Project initialization', () => {
  const root = path.resolve(__dirname, '../../');

  test('Next.js App Router project is initialized', () => {
    const packagePath = path.join(root, 'package.json');
    const layoutPath = path.join(root, 'src/app/layout.tsx');
    const dashboardPath = path.join(root, 'src/app/dashboard/page.tsx');

    expect(fs.existsSync(packagePath)).toBe(true);
    expect(fs.existsSync(layoutPath)).toBe(true);
    expect(fs.existsSync(dashboardPath)).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    expect(pkg.dependencies?.next).toBeDefined();
    expect(pkg.dependencies?.react).toBeDefined();
    expect(pkg.scripts?.dev).toBe('next dev');
  });
});
