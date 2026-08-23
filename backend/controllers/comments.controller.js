import CommentModel from "../models/comments.js";
import PetitionModel from "../models/petition.js";
import mongoose from "mongoose";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid petition ID" });
    }
    const petition = await PetitionModel.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    const comment = await CommentModel.create({
      petition: petition._id,
      user: req.user.id,   // from auth middleware
      text,
    });

    await comment.populate("user", "name email");
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid petition ID" });
    }
    const comments = await CommentModel.find({ petition: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /comments/:commentId
export const editComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!mongoose.isValidObjectId(req.params.commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only allow the owner to edit
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = text;
    await comment.save();
    await comment.populate("user", "name email");

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    // 🔍 Find comment by ID
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 🔒 Allow only the comment owner or an admin/official to delete
    if (comment.user.toString() !== req.user.id && req.user.role !== "official"){
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // 🗑️ Delete the comment
    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error while deleting comment" });
  }
};