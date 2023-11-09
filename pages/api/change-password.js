import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import auth from 'middleware/auth';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { username } = await auth(req, res);
    if (req.method === 'POST') {
        const { oldPassword,
            newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        const match = await bcrypt.compare(oldPassword, user.password);

        if (!user || !match) { // Bạn nên sử dụng một hàm băm mật khẩu an toàn
            return res.status(401).json({ error: 'Mật khẩu cũ không đúng!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: {
                username
            },
            data: {
                password: hashedPassword
            }
        })

        const token = jwt.sign({ username }, process.env.SECRET_TOKEN, { expiresIn: '3days' });
        return res.status(200).json({ token, message: 'Đổi mật khẩu thành công!' });
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
