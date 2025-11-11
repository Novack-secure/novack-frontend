import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostFrontmatter {
  category: string;
  title: string;
  author: string;
  date: string | Date;
  excerpt?: string;
  gradient?: string;
  cover?: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface PostSummary extends PostFrontmatter {
  slug: string;
  date: string;
}

const FRONTMATTER_KEYS_TO_QUOTE = new Set(["title", "excerpt", "author", "category"]);

function sanitizeFrontmatter(content: string): string {
  if (!content.startsWith('---')) return content;
  const lines = content.split(/\r?\n/);
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) return content;

  const fmLines = lines.slice(1, endIndex);
  const bodyLines = lines.slice(endIndex + 1);

  const processedFm = fmLines.map((line) => {
    const match = line.match(/^(\s*)([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!match) return line;
    const [, indent, key, rawValue] = match;
    if (!FRONTMATTER_KEYS_TO_QUOTE.has(key)) return line;
    const value = rawValue.trim();
    if (!value) return line;
    const isQuoted = (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));
    const needsQuoting = !isQuoted && value.includes(':');
    if (!needsQuoting) return line;
    const escaped = value.replace(/"/g, '\\"');
    return `${indent}${key}: "${escaped}"`;
  });

  return ['---', ...processedFm, '---', ...bodyLines].join('\n');
}

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'blog');

export function getSortedPostsData(): PostSummary[] {
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((name) => name.toLowerCase().endsWith('.md'));

  const allPostsData = fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const fileContents = sanitizeFrontmatter(raw);

      try {
        const matterResult = matter(fileContents);
        const fm = matterResult.data as PostFrontmatter;
        return {
          slug,
          ...fm,
          date: typeof fm.date === 'string' ? fm.date : String(fm.date),
        } satisfies PostSummary;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `Frontmatter inválido en src/content/blog/${fileName}. Asegúrate de envolver con comillas los valores que contengan ':' y caracteres especiales. Error:`,
          error
        );
        return null;
      }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null);

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const raw = await fs.promises.readFile(fullPath, 'utf8');
  const fileContents = sanitizeFrontmatter(raw);

  try {
    const matterResult = matter(fileContents);
    const fm = matterResult.data as PostFrontmatter;
    return {
      slug,
      ...fm,
      date: typeof fm.date === 'string' ? fm.date : String(fm.date),
      content: matterResult.content,
    } as PostSummary & { content: string };
  } catch (error) {
    throw new Error(
      `Frontmatter inválido en src/content/blog/${slug}.md. Envuelve con comillas los valores que contengan ':' (por ejemplo, title: "Texto: con dos puntos"). Error original: ${String(
        error
      )}`
    );
  }
}

export function getAllCategories(): string[] {
  const posts = getSortedPostsData();
  const set = new Set<string>();
  posts.forEach((p) => set.add(p.category));
  return Array.from(set).sort();
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.toLowerCase().endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}
