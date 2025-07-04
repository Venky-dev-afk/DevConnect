import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(req, res) {
    if(req.method != "POST"){
        return res.status(405).json({ message: "Only POST requests allowed"});
    }

    const { title, description, techStack, userId } = req.body;

    if(!title || !description || !techStack || !userId) {
        return res.status(400).json({ message: "all fields are required"});
    }

    try{
        const project = await prisma.project.create({
            data: {
                title,
                description,
                techStack,
                user: { connect: { id: userId }},
            },
        });

        res.status(201).json({ message: "Project created", project });
    } 
    catch(error) {
        console.error("Add project Error:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}