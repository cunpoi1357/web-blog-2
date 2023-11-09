import jwt from 'jsonwebtoken';

const auth = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        return decoded
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};

export default auth;
