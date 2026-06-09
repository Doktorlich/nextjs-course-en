import { notFound } from "next/navigation";
import { getNewsForYear } from "@/lib/news";
import NewsList from "@/components/news-list";

export default async function FilteredNewsPage({ params }) {
    const { yearSlug } = await params;
    const news = getNewsForYear(yearSlug);
    const filteredNews = news.find(newsItem => newsItem.date.split("-")[0] === yearSlug);

    if (!filteredNews) {
        notFound();
    }
    return (
    <NewsList news={news}/>
    );
}
