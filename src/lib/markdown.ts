import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, type Tokens } from 'marked';
import katex from 'katex';

const contentDirectory = path.join(process.cwd(), 'src/content');

interface CalloutToken extends Tokens.Generic {
  meta: string;
  text: string;
}

interface MathToken extends Tokens.Generic {
  text: string;
}

// Hackmd-style blocks like :::danger etc
const CALLOUTS: Record<string, { cls: string; label: string }> = {
  danger:  { cls: 'border-red-300 bg-red-50 text-red-900',        label: 'Critical' },
  warning: { cls: 'border-amber-300 bg-amber-50 text-amber-900',  label: 'Warning' },
  info:    { cls: 'border-blue-300 bg-blue-50 text-blue-900',     label: 'Note' },
  success: { cls: 'border-green-300 bg-green-50 text-green-900',  label: 'No issue' },
};
const calloutExtension = {
  name: 'callout',
  level: 'block' as const,
  start(src: string) {
    return src.match(/^:::/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^:::(danger|warning|info|success)\s*\n([\s\S]*?)\n:::/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'callout',
        raw: match[0],
        meta: match[1],
        text: match[2].trim(),
        tokens: [],
      };
    }
  },
  renderer(token: CalloutToken) {
    const c = CALLOUTS[token.meta] ?? CALLOUTS.info;
    const inner = marked.parse(token.text);
    return `<div class="not-prose callout mb-4 min-w-0 max-w-full rounded-lg border px-5 py-4 ${c.cls} [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:min-w-0 [&_p]:break-words [&_p]:overflow-wrap-anywhere">${inner}</div>`;
  },
};

// Config to nicely render latex equations in markdown
const mathBlock = {
  name: 'mathBlock',
  level: 'block' as const,
  start(src: string) { return src.indexOf('$$'); },
  tokenizer(src: string) {
    const m = /^\$\$([\s\S]+?)\$\$/.exec(src);
    if (m) return { type: 'mathBlock', raw: m[0], text: m[1].trim(), tokens: [] };
  },
  renderer(token: MathToken) {
    return katex.renderToString(token.text, { displayMode: true, throwOnError: false });
  },
};
const mathInline = {
  name: 'mathInline',
  level: 'inline' as const,
  start(src: string) { return src.indexOf('$'); },
  tokenizer(src: string) {
    const m = /^\$([^\$\n]+?)\$/.exec(src);
    if (m) return { type: 'mathInline', raw: m[0], text: m[1].trim(), tokens: [] };
  },
  renderer(token: MathToken) {
    return katex.renderToString(token.text, { displayMode: false, throwOnError: false });
  },
};

marked.use({ extensions: [calloutExtension, mathBlock, mathInline] });

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
