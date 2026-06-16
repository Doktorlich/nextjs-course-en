import { notFound, useRouter } from "next/navigation";
import ModalBackdrop from "@/components/ModalBackdrop";
import { getNewsItem } from "@/lib/news";

export default async function InterceptedImagePage({ params }) {
    const { idSlug } = await params;
    const news = await getNewsItem(idSlug)
    // const news = DUMMY_NEWS.find(item => item.slug === idSlug);

    if (!news) {
        return notFound();
    }
    return (
        <>
            <ModalBackdrop />
            <dialog className={"modal"} open>
                <div className={"fullscreen-image"}>
                    <img src={`/images/news/${news.image}`} alt={news.title} />
                </div>
            </dialog>
        </>
    );
}
