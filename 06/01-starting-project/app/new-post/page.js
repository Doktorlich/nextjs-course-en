"use client";
import { createPost } from "@/actions/posts.js";
import PostForm from "@/components/post-form.js";

export default function NewPostPage() {
    return <PostForm action={createPost} />;
}
