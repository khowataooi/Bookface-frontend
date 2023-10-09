import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";

const Dashboard = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          "http://localhost:8080/api/posts",
          config
        );
        setPosts(response.data);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:8080/api/posts",
        {
          content: newPost,
        },
        config
      );
      if (response.status === 201) {
        console.log("New post created:", response.data);
        setPosts([...posts, response.data]);
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
        const token = localStorage.getItem("jwt");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.put(
          `http://localhost:8080/api/posts/${postId}`,
          { content: newContent },
          config
        );
        if (response.status === 200) {
          // Update the local posts state
          const updatedPosts = posts.map((post) =>
            post.id === postId ? { ...post, content: newContent } : post
          );
          setPosts(updatedPosts);
        }
      } catch (error) {
        console.log("Error editing post:", error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("jwt");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.delete(
          `http://localhost:8080/api/posts/${postId}`,
          config
        );
        if (response.status === 200) {
          // Update the local posts state
          const updatedPosts = posts.filter((post) => post.id !== postId);
          setPosts(updatedPosts);
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
        {posts.map((post, index) => (
          <div key={index}>
            <p>{post.content}</p>
            <button onClick={() => handleEditPost(post.id, post.content)}>
              Edit
            </button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            <Comment postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
