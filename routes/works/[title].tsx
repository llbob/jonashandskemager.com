import { Handlers, PageProps } from "$fresh/server.ts";
import { MainLayout } from "../../components/MainLayout.tsx";
import { Work } from "../../types/cultproject.ts";
import { getWorkById } from "../../utils/works.ts";
import ProjectCarousel from "../../islands/ProjectCarousel.tsx";
import { Project } from "../../types/project.ts";

export const handler: Handlers<Work | null> = {
  async GET(_req, ctx) {
    const project = await getWorkById(ctx.params.title);
    return ctx.render(project);
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
        {data.images.length > 0 && <ProjectCarousel project={data as unknown as Project} />}
      </div>
    </MainLayout>
  );
} 