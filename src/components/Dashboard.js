import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";

const Dashboard = () => {
  const [newPost, setNewPost] = useState("");
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts");
        setPost(response.data);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/posts", {
        content: newPost,
      });
      if (response.status === 201) {
        console.log("New post created:", response.data);
        setPost([...post, response.data]);
        setNewPost("");
      }
    } catch (error) {
      console.log("Error creating new post:", error);
    }
    console.log("New post: ", newPost);
  };

  const handleEditPost = async (postId, currentContent) => {
    const newContent = prompt("Edit your post:", currentContent);
    if (newContent) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/posts/${postId}`,
          { content: newContent }
        );
        if (response.status === 200) {
          // Update the local posts state
          const updatedPosts = post.map((post) =>
            post.id === postId ? { ...post, content: newContent } : post
          );
          setPost(updatedPosts);
        }
      } catch (error) {
        console.log("Error editing post:", error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/posts/${postId}`
        );
        if (response.status === 200) {
          // Update the local posts state
          const updatedPosts = post.filter((post) => post.id !== postId);
          setPost(updatedPosts);
        }
      } catch (error) {
        console.log("Error deleting post:", error);
      }
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Write a New Post</h2>
        <form onSubmit={handleNewPost}>
          <textarea
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => {
              setNewPost(e.target.value);
            }}
          />
          <button type="submit">Post</button>
        </form>
      </div>
      <div>
        <h2>Existing Posts</h2>
        {post.map((post, index) => (
          <div key={index}>
            <p>{post.content}</p>
            <button onClick={() => handleEditPost(post.id, post.content)}>Edit</button>
            <button onclick={() => handleDeletePost(post.id)}>Delete</button>
            <Comment postId={post.id}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
