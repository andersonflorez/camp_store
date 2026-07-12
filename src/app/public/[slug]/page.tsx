import { notFound } from "next/navigation";
import PublicRanking from "@/components/PublicRanking";
import { getRankingBySlug } from "@/lib/ranking";

interface PublicPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
    const { slug } = await params;
    const payload = await getRankingBySlug(slug);

    if (!payload) {
        notFound();
    }

    return (
        <PublicRanking
            slug={payload.campSlug}
            initialCampName={payload.campName}
            initialRanking={payload.ranking}
        />
    );
}
