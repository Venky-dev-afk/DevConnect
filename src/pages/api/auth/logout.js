import cookie from 'cookie'

export default async function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    try {
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("devconnect_token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(0),
                sameSite: "lax",
                path: "/",
            })
        );
    
        console.log("Logout API hit");
    
        return res.status(200).json({ message: "Logged out successfully" });
    } catch(err){
        console.error("Logout Error:", err);
        return res.status(500).json({ message: "Logout failed" });
    }
}