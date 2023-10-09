import React, { useState } from "react";
import axios from "axios";

const Comment = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");


  const handleNewComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/comments/${postId}`,
        {
          content: newComment,
        }
      );
      if (response.status === 201) {
        setComments([...comments, response.data]);
        setNewComment("");
      }
    } catch (error) {
      console.log("Error adding new comment:", error);
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/comments/${commentId}`,
        { content: editingContent }
      );
      if (response.status === 200) {
        const updatedComments = comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editingContent }
            : comment
        );
        setComments(updatedComments);
        setEditingCommentId(null);
        setEditingContent("");
      }
    } catch (error) {
      console.log("Error updating comment:", error);
    }
  };


  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/comments/${commentId}`
        );
        if (response.status === 200) {
          const updatedComment = comments.filter(
            (comment) => comment.id !== commentId
          );
          setComments(updatedComment);
        }
      } catch (error) {
        console.log("Error deleting comment:", error);
      }
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleNewComment}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Comment</button>
      </form>
      {comments.map((comment, index) => (
  <div key={index}>
    {editingCommentId === comment.id ? (
      <div>
        <input
          type="text"
          value={editingContent}
          onChange={(e) => setEditingContent(e.target.value)}
        />
        <button onClick={() => handleUpdateComment(comment.id)}>Submit</button>
        <button onClick={() => setEditingCommentId(null)}>Cancel</button>
      </div>
    ) : (
      <div>
        <p>{comment.content}</p>
        <button onClick={() => handleEditComment(comment.id, comment.content)}>Edit</button>
        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
      </div>
    )}
  </div>
))}

    </div>
  );
};

export default Comment;
