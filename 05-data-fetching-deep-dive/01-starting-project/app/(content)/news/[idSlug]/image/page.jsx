import { notFound } from "next/navigation";
import { DUMMY_NEWS } from "@/dummy-news";

export default async function ImagePage({ params }) {
    const { idSlug } = await params;
    const news = DUMMY_NEWS.find(item => item.slug === idSlug);

    if (!news) {
        return notFound();
    }
    return (
        <div className={"fullscreen-image"}>
            <img src={`/images/news/${news.image}`} alt={news.title} />
        </div>
    );
}
