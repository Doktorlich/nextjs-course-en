import { notFound } from "next/navigation";
import { getNewsItem } from "@/lib/news";

export default async function ImagePage({ params }) {
    const { idSlug } = await params;
    // const news = DUMMY_NEWS.find(item => item.slug === idSlug);

    const newsItem = await getNewsItem(idSlug);

    if (!newsItem) {
        return notFound();
    }
    return (
        <div className={"fullscreen-image"}>
            <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
        </div>
    );
}
