import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        const match = await bcrypt.compare(password, user.password);

        if (!user || !match) { // Bạn nên sử dụng một hàm băm mật khẩu an toàn
            return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ' });
        }

        const token = jwt.sign({ username }, process.env.SECRET_TOKEN, { expiresIn: '7days' });
        return res.status(200).json({ token });
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
