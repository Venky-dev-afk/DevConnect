import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma';


export default async function handler(req, res){
    if(req.method !== "POST"){
        return res.status(405).json({ message: "Only POST requests allowed"});
    }

    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try{
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if(existingUser){
            return res.status(409).json({message: "User already exists"});
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    
        return res.status(201).json({ message: "User created Successfully"});
    } 
    catch (error){
        console.error("Signup Error:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
    
}