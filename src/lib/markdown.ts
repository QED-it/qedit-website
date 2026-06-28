import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentDirectory = path.join(process.cwd(), 'src/content');

export function getMarkdownData<T>(subFolder: string, fileName: string): { data: T; content: string } {
    const filePath = path.join(contentDirectory, subFolder, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return { data: data as T, content };
}

export function getMarkdownFiles<T>(subFolder: string): Array<{ fileName: string; data: T; content: string }> {
    const directoryPath = path.join(contentDirectory, subFolder);
    const fileNames = fs.readdirSync(directoryPath);
    return fileNames.map((fileName) => {
        const filePath = path.join(directoryPath, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        return { fileName, data: data as T, content };
    });
}

export async function markdownToHtml(md: string): Promise<string> {
  return marked.parse(md);
}
