import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export function getMarkdownData(subFolder: string, fileName: string) {
    const filePath = path.join(contentDirectory, subFolder, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return { data, content };
}

export function getMarkdownFiles(subFolder: string) {
    const directoryPath = path.join(contentDirectory, subFolder);
    const fileNames = fs.readdirSync(directoryPath);
    return fileNames.map((fileName) => {
        const filePath = path.join(directoryPath, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return { fileName, data };
    });
}
