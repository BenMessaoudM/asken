import type { Metadata } from "next";
import { and, eq, lte, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicInfoPage from "@/components/public-info-page";
import { getDb } from "@/db";
import { contentItems } from "@/db/schema";
import { publicPages, type PublicPageDefinition } from "@/lib/public-pages";

export const dynamic = "force-dynamic";

async function loadPage(slug: string): Promise<PublicPageDefinition | null> {
  const base = publicPages[slug];
  if (!base) return null;

  try {
    const now = new Date().toISOString();
    const [managed] = await getDb()
      .select()
      .from(contentItems)
      .where(and(
        eq(contentItems.type, "page"),
        eq(contentItems.slug, slug),
        eq(contentItems.reviewStatus, "approved"),
        or(
          eq(contentItems.status, "published"),
          and(eq(contentItems.status, "scheduled"), lte(contentItems.publishAt, now))
        )
      ))
      .limit(1);

    if (!managed) return base;
    const title = base.lang === "sv" ? managed.titleSv : (managed.titleEn || managed.titleSv);
    const lead = base.lang === "sv" ? managed.summarySv : (managed.summaryEn || managed.summarySv);
    const body = base.lang === "sv" ? managed.bodySv : (managed.bodyEn || managed.bodySv);
    return {
      ...base,
      title: title || base.title,
      lead: lead || base.lead,
      sections: body.trim()
        ? [{
            title: base.sections[0]?.title || "Information",
            body: body.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean),
          }]
        : base.sections,
    };
  } catch {
    return base;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadPage(slug);
  if (!page) return {};
  return {
    title: `${page.title} | ASK`,
    description: page.lead,
    alternates: {
      canonical: `/${slug}`,
      languages: { [page.lang]: `/${slug}`, [page.lang === "sv" ? "en" : "sv"]: page.alternate },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await loadPage(slug);
  if (!page) notFound();
  return <PublicInfoPage page={page} slug={slug} />;
}
