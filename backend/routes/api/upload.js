const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const upload = multer({ dest: "uploads/" });

// POST route to upload an image
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  const fileContent = fs.readFileSync(req.file.path);


  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_${req.file.originalname}`, // File name you want to save as in S3
    Body: fileContent,
    ACL: "public-read", // Makes file publicly accessible
    ContentType: req.file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    // Return the URL to the uploaded image
    return res.json({ imageUrl: data.Location });
  } catch (err) {
    console.error("Error uploading to S3:", err);
    return res.status(500).json({ error: "Failed to upload image" });
  } finally {
    fs.unlinkSync(req.file.path); // Clean up the uploaded file
  }
});

module.exports = router;
