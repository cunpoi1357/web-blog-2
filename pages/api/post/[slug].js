import auth from 'middleware/auth';
const fs = require("fs");
const path = require("path");
const config = require("@config/config.json");
const { blog_folder } = config.settings;

export default async function handler(req, res) {
    await auth(req, res);
    const slug = req.query.slug
    switch (req.method) {
        case 'GET':
            {
                const getPosts = fs.readdirSync(path.join(`content/${blog_folder}`));
                const filterPosts = getPosts.filter((post) => post.match(/^(?!_)/));
                const posts = filterPosts.map((filename) => {
                    const slug = filename.replace(".md", "");
                    const postData = fs.readFileSync(
                        path.join(`content/${blog_folder}/`, filename),
                        "utf-8"
                    );
                    return {
                        postData,
                        slug: slug,
                    };
                });

                const post = posts.find(post => post.slug === slug);

                return res.status(200).json(post);
            }
        case 'DELETE':
            {
                const filePath = path.join(`content/${blog_folder}/${slug}.md`)
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

                return res.status(200).json({ message: 'Xóa bài viết thành công', revalidated: true });
            }
        case 'PUT':
            {
                const filePath = path.join(`content/${blog_folder}/${slug}.md`)
                if (fs.existsSync(filePath)) fs.writeFileSync(filePath, req.body.content)
                revalidate()
                return res.status(200).json({ message: 'Cập nhật thành công' });
            }
        default:
            return res.status(405).json({ error: 'Method Not Allowed' });
    }
}