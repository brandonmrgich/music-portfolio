const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// API endpoint for form submission
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  // Here you would typically save this to a database or send an email
  console.log("Form submission:", { name, email, message });
  res.json({ success: true });
});

// API endpoint for fetching audio metadata
app.get("/api/audio", (req, res) => {
  const audioFiles = fs
    .readdirSync("uploads")
    .filter((file) => file.endsWith(".mp3"))
    .map((file) => ({
      id: path.basename(file, ".mp3"),
      title: path.basename(file, ".mp3"),
      src: `/api/audio/${path.basename(file, ".mp3")}`,
    }));
  res.json(audioFiles);
});

// API endpoint for streaming audio
app.get("/api/audio/:id", (req, res) => {
  const filePath = path.join(__dirname, "uploads", `${req.params.id}.mp3`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Audio file not found" });
  }
});

// API endpoint for uploading audio
app.post("/api/audio", upload.single("audio"), (req, res) => {
  if (req.file) {
    res.json({ success: true, id: path.basename(req.file.filename, ".mp3") });
  } else {
    res.status(400).json({ error: "No audio file uploaded" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
