import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem } from "../../../../lib/news";

export default async function NewsDetailPage({ params }) {
    const { idSlug } = await params;
    const newsItem = await getNewsItem(idSlug);


    // const newsItem = DUMMY_NEWS.find(item => item.slug === idSlug);
    if (!newsItem) {
        return notFound();
    }

    return (
        <article className={"news-article"}>
            <header>
                <Link href={`/news/${newsItem.slug}/image `}>
                    <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
                </Link>
                <h1>{newsItem.title}</h1>
                <time dateTime={newsItem.date}>{newsItem.date}</time>
            </header>
            <p>{newsItem.content}</p>
        </article>
    );
}
