import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in .env");
}


export default async function handler(req,res){
    if(req.method != "POST"){
        return res.status(405).json({message: "Only POST requests allowed"});
    }

    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({message : "Email and password are required" });
    }


    try{
        const user = await prisma.user.findUnique({
            where: {email},
        });
        if(!user){
            return res.status(401).json({ message: "Please Signin before Logging in" });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }

        //Creating token
        const token = jwt.sign({ id:user.id }, JWT_SECRET, {expiresIn: "7d"});

        //set cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("devconnect_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge:  60 * 60,
                path: "/",
            })
        );
    
        return res.status(200).json({ message: "Login successful" });

    }
    catch(error){
        console.error("JWT Login error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}