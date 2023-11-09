const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Xóa dữ liệu cũ và tạo người dùng mới
    await prisma.User.deleteMany({}); // Cảnh báo: lệnh này sẽ xóa tất cả người dùng trong DB!
    await prisma.User.create({
        data: {
            username: 'admin',
            password: hashedPassword,
        },
    });
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
