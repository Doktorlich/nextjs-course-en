import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewsList({ news }) {

    if (!news) {
        return notFound();
    }
    /* eslint-disable react/prop-types */
    return (
        <ul className={"news-list"}>
            {news?.map(newsItem => {
                return (
                    <li key={newsItem.id}>
                        <Link href={`/news/${newsItem.slug}`}>
                            <img src={`/images/news/${newsItem.image}`} alt={newsItem.title} />
                            <h3>{newsItem.title}</h3>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
