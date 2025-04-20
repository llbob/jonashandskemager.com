import { Handlers, PageProps } from "$fresh/server.ts";
import { MainLayout } from "../components/MainLayout.tsx";
import { Work } from "../types/cultproject.ts";
import { getWorks } from "../utils/works.ts";
import ProjectCarousel from "../islands/ProjectCarousel.tsx";
import { Project } from "../types/project.ts";
import { getCV } from "../utils/cv.ts";
import type { CV } from "../types/cv.ts";

// Combined data type for our page
interface HomePageData {
  works: Work[];
  cv: CV;
}

export const handler: Handlers<HomePageData> = {
  async GET(_req, ctx) {
    const [works, cv] = await Promise.all([
      getWorks(),
      getCV(),
    ]);
    
    return ctx.render({
      works: works || [],
      cv: cv || { sections: [], content: "" }
    });
  },
};

export default function HomePage({ data }: PageProps<HomePageData>) {
  const { works, cv } = data;

  return (
    <MainLayout>
      <div>
        {/* About Section */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <div className="">
            {cv.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <p className="text-xl font-serif mb-2">{section.title}</p>
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div dangerouslySetInnerHTML={{ __html: cv.content }} />
          </div>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 gap-16 mb-8">
          {works.length === 0 ? (
            <p>No cultural projects found.</p>
          ) : (
            works.map((project) => (
              <div className="w-full" key={project.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* First column: Title and metadata */}
                  <div>
                    <div className="mt-0">
                      {project.images && project.images.length > 0 && (
                        <ProjectCarousel project={project as unknown as Project} />
                      )}
                    </div>
                  </div>

                  {/* Second column: Content and carousel */}
                  <div>
                    <p className="text-sm font-serif italic">Work - {project.year}</p>
                    <p className="text-xl font-serif mb-2 pt-1">{project.title}</p>
                    <div className="mb-4" dangerouslySetInnerHTML={{ __html: project.content }} />
                  </div>
                </div>
                <hr className="mt-8 border-gray-200" />
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}