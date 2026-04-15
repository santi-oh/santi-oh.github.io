import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure photos directory exists
  const photosDir = path.join(__dirname, "photos");
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir);
  }

  // API to list photos
  app.get("/api/photos", (req, res) => {
    try {
      const files = fs.readdirSync(photosDir);
      const photoFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );
      
      const photos = photoFiles.map((file, index) => ({
        id: String(index + 1),
        name: file,
        url: `/photos/${file}`
      }));
      
      res.json(photos);
    } catch (error) {
      console.error("Error reading photos directory:", error);
      res.status(500).json({ error: "Failed to read photos directory" });
    }
  });

  // Serve photos directory statically
  app.use("/photos", express.static(photosDir));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
