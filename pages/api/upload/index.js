import multer from 'multer';
import fs from 'fs';
import path from 'path';
import auth from 'middleware/auth';

// Khởi tạo multer với nơi lưu trữ tạm thời
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  })
});

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser mặc định của Next.js
  },
};

export default async (req, res) => {
  await auth(req, res);
  switch (req.method) {
    case 'GET':
      const getFiles = fs.readdirSync(path.join(`public/uploads`));
      res.status(200).json({ fileNames: getFiles.map(fileName => `uploads/${fileName}`) });
      break
    case 'POST':
      // Xử lý tải lên tập tin với multer
      upload.single('file')(req, {}, (err) => {
        if (err) {
          return res.status(500).end('Upload error');
        }

        res.status(200).json({ message: 'File uploaded successfully' });
      });
      break
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }

};
