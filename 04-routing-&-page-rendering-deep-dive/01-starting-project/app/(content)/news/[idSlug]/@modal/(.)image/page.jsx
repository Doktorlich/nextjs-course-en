"use client";

import { notFound, useRouter } from "next/navigation";
import { DUMMY_NEWS } from "@/dummy-news";

export default async function InterceptedImagePage({ params }) {
    const router = useRouter();

    const { idSlug } = await params;
    const news = DUMMY_NEWS.find(item => item.slug === idSlug);

    if (!news) {
        return notFound();
    }
    return (
        <>
            <div className={"modal-backdrop"} onClick={router.back}></div>
            <dialog className={"modal"} open>
                <div className={"fullscreen-image"}>
                    <img src={`/images/news/${news.image}`} alt={news.title} />
                </div>
            </dialog>
        </>
    );
}
