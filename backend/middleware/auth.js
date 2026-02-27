import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Please login to continue' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.student = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Session expired or invalid. Please login again.' });
    }
};

export default protect;
