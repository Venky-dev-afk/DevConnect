import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disables default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/public/uploads");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => Date.now() + "_" + part.originalFilename,
  });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Upload failed" });

    const file = files.image[0];
    const url = `/uploads/${file.newFilename}`;

    res.status(200).json({ imageUrl: url });
  });
}
