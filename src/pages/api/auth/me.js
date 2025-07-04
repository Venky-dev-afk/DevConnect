import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import cookie from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in the .env")
}

export default async function handler(req, res) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.devconnect_token;

    if(!token){
        return res.status(401).json({ message: "Not authenticated" });
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id:true, name:true, email: true},
        });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch(err){
        return res.status(401).json({ message: "Invalid token" });
    }
}