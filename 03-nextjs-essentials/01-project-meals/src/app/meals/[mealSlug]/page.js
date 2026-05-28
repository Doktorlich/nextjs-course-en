import Link from "next/link";

export default async function MealPage({ params }) {
    const { mealSlug } = await params;
    return (
        <main>
            <h1>The Meal</h1>
            <p>{mealSlug}</p>
            <p>
                <Link href={"/meals"}>Back</Link>
            </p>
        </main>
    );
}
