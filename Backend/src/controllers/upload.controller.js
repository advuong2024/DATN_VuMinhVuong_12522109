const cloudinary = require("../utils/cloudinary");
const { isVideo } = require("../config/upload");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Vui lòng chọn file" });
    }

    const options = {
      folder: "phongkham",
      resource_type: isVideo(req.file.mimetype) ? "video" : "image",
    };

    const result = await cloudinary.uploader.upload(req.file.path, options);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};
