import PostForm from "@/components/post-form.js";
import { storePost } from "@/lib/posts.js";
import { redirect } from "next/navigation.js";

export default function NewPostPage() {
    async function createPost(prevState, formDate) {
        "use server";
        const title = formDate.get("title");
        const image = formDate.get("image");
        const content = formDate.get("content");

        let errors = [];
        if (!title || title.trim().length === 0) {
            errors.push("Title is requared.");
        }

        if (!content || content.trim().length === 0) {
            errors.push("Content is requared.");
        }

        if (!image || image.size === 0) {
            errors.push("Image is requared.");
        }
        if (errors.length > 0) {
            return { errors };
        }
        await storePost({ imageUrl: "", title, content, userId: 1 });
        redirect("/feed");
    }
    return <PostForm action={createPost} />;
}
