import { Handlers, PageProps } from "$fresh/server.ts";
import { MainLayout } from "../../components/MainLayout.tsx";
import { Work } from "../../types/works.ts";
import { getWorkById } from "../../utils/works.ts";
import WorkCarousel from "../../islands/WorkCarousel.tsx";

export const handler: Handlers<Work | null> = {
  async GET(_req, ctx) {
    const work = await getWorkById(ctx.params.title);
    return ctx.render(work);
  },
};

export default function WorkPage({ data }: PageProps<Work>) {
  if (!data) {
    return (
      <MainLayout>
        <p>Work not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div class="max-w-4xl mx-auto my-4 md:my-8 md:px-8">
        <p class="text-sm font-serif italic">Work - {data.year}</p>
        <p class="text-xl font-serif mb-2 pt-1">{data.title}</p>
        <div class="mb-4" dangerouslySetInnerHTML={{ __html: data.content }} />
        
        {/* References Section */}
        {data.references && data.references.length > 0 && (
          <div class="mt-8 pt-4 border-t border-black">
            <p class="text-sm font-serif italic mb-2">References</p>
            <ol class="list-decimal pl-6">
              {data.references.map((ref, idx) => (
                <li key={idx} class="text-sm mb-2" id={`ref-${ref.referenceNumber}`}>
                  <span dangerouslySetInnerHTML={{ __html: ref.reference }} />
                </li>
              ))}
            </ol>
          </div>
        )}
        
        {data.images.length > 0 && <WorkCarousel work={data as unknown as Work} />}
      </div>
    </MainLayout>
  );
}