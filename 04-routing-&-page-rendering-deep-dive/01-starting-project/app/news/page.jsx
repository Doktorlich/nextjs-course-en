import classes from "./page.module.css";
import Link from "next/link";
import { DUMMY_NEWS } from "@/dummy-news";
import Image from "next/image";

export default function NewsPage() {
    return (
        <>
            <h1>News Page</h1>
            <ul className={"news-list"}>
                {DUMMY_NEWS.map(news => {
                    return (
                        <li key={news.id}>
                            <Link href={`/news/${news.slug}`}>
                                <img src={`/images/news/${news.image}`} alt={news.title} />
                                <h3>{news.title}</h3>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
