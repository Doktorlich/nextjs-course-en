import { DUMMY_NEWS } from "@/dummy-news";
import { notFound } from "next/navigation";

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
