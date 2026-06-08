import { notFound } from "next/navigation";
import { DUMMY_NEWS } from "@/dummy-news";
export default async function NewsDetailPage({ params }) {
    const { idSlug } = await params;
    const news = DUMMY_NEWS.find(item => item.slug === idSlug);

    if (!news) {
        return notFound();
    }

    return (
        <article className={"news-article"}>
            <header>
                <img src={`/images/news/${news.image}`} alt={news.title} />
                <h1>{news.title}</h1>
                <time dateTime={news.date}>{news.date}</time>
            </header>
            <p>{news.content}</p>
        </article>
    );
}
