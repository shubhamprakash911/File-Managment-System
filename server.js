const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Define the file schema
const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const File = mongoose.model("File", fileSchema);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// API endpoints
app.use(express.json());
app.use(cors());

app.get("/api/files", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const newFile = new File({ filename, path });
    await newFile.save();
    res.json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    // Delete file from uploads folder
    const filePath = path.join(__dirname, "uploads", file.filename);
    require("fs").unlinkSync(filePath);
    // Remove file record from the database
    await File.findByIdAndDelete(id);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
