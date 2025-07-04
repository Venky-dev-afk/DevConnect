import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function handler(req, res){
    const { id } = req.query;

    if(req.method === "GET") {
        try{
            const project = await prisma.project.findUnique({
                where: { id:parseInt(id) },
                include: { user:true },
            });

            if(!project) return res.status(404).json({ message: "Not found"});

            res.status(200).json(project);
        }
        catch(error){
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    if(req.method === "DELETE"){
        try{
            const token = req.cookies.devconnect_token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            
            const project = await prisma.project.findUnique({ where: { id: parseInt(id) }});

            if(!project || project.userId !== userId) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            await prisma.project.delete({ where: { id: parseInt(id) }});
            return res.status(200).json({ message: "Deleted"});
        }
        catch(err){
            console.error("Delete error:", err);
            return res.status(500).json({ message: "Error deleting project" });
        }
    }

    if (req.method === "PUT") {
        try {
            const token = req.cookies.devconnect_token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const project = await prisma.project.findUnique({ where: { id: parseInt(id) } });

            if (!project || project.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
            }

            const { title, description, techStack } = req.body;

            const updated = await prisma.project.update({
            where: { id: parseInt(id) },
            data: { title, description, techStack },
            });

            return res.status(200).json(updated);
        } catch (err) {
            console.error("Update error:", err);
            return res.status(500).json({ message: "Update failed" });
        }
    }


    //if method is not GET or DELETE
    return res.status(405).json({ message: "Method not allowed" })
}