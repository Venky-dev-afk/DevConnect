import prisma from "@/lib/prisma";

export default async function handler(req, res){
    if(req.method !== "GET"){
        return res.status(405).json({ message:"Only GET requests allowed" });
    }

    try{
        const projects = await prisma.project.findMany({
            include: { user: { select: { name: true }}},
            orderBy: { createdAt: "desc"}
        });

        res.status(200).json({ projects });
    }
    catch(error){
        console.error("Project Listing Error:", error);
        res.status(500).json({ message: "Internal Sever Error" });
    }
}