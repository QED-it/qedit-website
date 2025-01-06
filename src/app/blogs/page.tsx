import { getMarkdownFiles } from '@/lib/markdown';

export default function BlogsPage() {
    const blogs = getMarkdownFiles('blogs');

    return (
        <div>
            <h1>Blog Posts</h1>
            <ul>
                {blogs.map(({ fileName, data }) => (
                    <li key={fileName}>
                        <h2>{data.title}</h2>
                        <p>{data.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
