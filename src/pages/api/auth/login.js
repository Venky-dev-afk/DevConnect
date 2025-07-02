import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma';


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
    
        return res.status(200).json({ message: "Login successful", user: {id: user.id, name: user.name, email: user.email }});

    }
    catch(error){
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}