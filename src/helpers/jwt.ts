import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: any) => {
    return jwt.sign(
        { id: userId },
        SECRET_KEY,
        { expiresIn: '1h', }
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};
