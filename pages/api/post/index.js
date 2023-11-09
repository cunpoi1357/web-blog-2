import auth from 'middleware/auth';
import matter from "gray-matter";
import slugify from 'slugify'
const fs = require("fs");
const path = require("path");
const config = require("@config/config.json");
const { blog_folder } = config.settings;


export default async function handler(req, res) {
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

                    const { data } = matter(postData);
                    const content = matter(postData).content;


                    return {
                        title: data.title,
                        content: content,
                        slug
                    }
                });
                return res.status(200).json(posts);

            }
        case 'POST':
            {
                await auth(req, res);
                const { data } = matter(req.body.content);
                const slug = slugify(data.title) + Math.random().toString(36).slice(0, 5).toString()
                fs.writeFileSync(path.join(`content/${blog_folder}/${slug}.md`), req.body.content);


                res.status(200).json({ message: 'Tạo bài viết thành công' });
                break
            }
        default:
            return res.status(405).json({ error: 'Method Not Allowed' });
    }
}