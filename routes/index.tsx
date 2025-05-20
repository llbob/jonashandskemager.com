import { Handlers, PageProps } from "$fresh/server.ts";
import { MainLayout } from "../components/MainLayout.tsx";
import { Work } from "../types/works.ts";
import { getWorks } from "../utils/works.ts";
import WorkCarousel from "../islands/WorkCarousel.tsx";
import { getCV } from "../utils/cv.ts";
import type { CV } from "../types/cv.ts";
import { getAbout } from "../utils/about.ts";
import type { About } from "../types/about.ts";

// Combined data type for our page
interface HomePageData {
  works: Work[];
  about: About;
  cv: CV;
}

export const handler: Handlers<HomePageData> = {
  async GET(_req, ctx) {
    const [works, about, cv] = await Promise.all([
      getWorks(),
      getAbout(),
      getCV(),
    ]);

    return ctx.render({
      works: works || [],
      about: about || { content: "" },
      cv: cv || { sections: [], content: "" }
    });
  },
};

export default function HomePage({ data }: PageProps<HomePageData>) {
  const { works, about, cv } = data;

  return (
    <MainLayout>
      <div>
        {/* About Section */}
        <div className="mb-12 pb-8">
          <div className="">
            <div dangerouslySetInnerHTML={{ __html: about.content }} />
          </div>
        </div>

        {/* Works Section */}
        <div className="grid grid-cols-1 gap-16 mb-16">
          {works.length === 0 ? (
            <p>No works found.</p>
          ) : (
            works.map((work) => (
              <div className="w-full mb-4" key={work.id}>
                <p className="block lg:hidden text-xl font-serif mb-1">{work.title}</p>
                {/* Display additional work info if available */}
                {work.additional && work.additional.length > 0 && (
                  <div className="block lg:hidden mb-4">
                    {work.additional.map((info, idx) => (
                      <p key={idx} className="text-xs font-serif mb-1">
                        {info.string}
                      </p>
                    ))}
                  </div>
                )}

                {/* Work content and references */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* First column: HeaderImage and Carousel */}
                  <div className="flex flex-col gap-4">
                    {/* {work.headerImageUrl && (
                      <img
                        class="w-full h-auto min-h-[400px] object-cover mt-2"
                        src={work.headerImageUrl}
                        alt={work.title}
                      />
                    )} */}
                    <div className="mt-0">
                      {work.images && work.images.length > 0 && (
                        <WorkCarousel work={work as unknown as Work} />
                      )}
                    </div>
                  </div>

                  {/* Second column: Title, content and references */}
                  <div>
                    <p className="hidden lg:block text-xl font-serif mb-1">{work.title}</p>
                    {work.additional && work.additional.length > 0 && (
                      <div className="hidden lg:block mb-4">
                        {work.additional.map((info, idx) => (
                          <p key={idx} className="text-sm font-serif mb-1">
                            {info.string}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="mb-4" dangerouslySetInnerHTML={{ __html: work.content }} />
                    {work.references && work.references.length > 0 && (
                      <div className="mt-0 pt-0 break-words">
                        <ol className="">
                          {work.references.map((ref, idx) => (
                            <li key={idx} className="w-full text-xs mb-2" id={`ref-${ref.referenceNumber}`}>
                              <span className="text-sm font-serif mr-2">
                                [{ref.referenceNumber}]
                              </span>
                              {/* Use dangerouslySetInnerHTML to render HTML content */}
                              <span dangerouslySetInnerHTML={{ __html: ref.reference }} />
                              {/* <span className="text-sm">{ref.reference}</span> */}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CV Section */}
        <div id="cv" className="mb-12 pb-8 w-full lg:w-3/4 h-screen">
          <p className="text-xl font-serif mb-6 pt-4">CV</p>

          {/* Additional CV content in full width */}
          {cv && cv.content && cv.content.length > 0 && (
            <div className="mb-4" dangerouslySetInnerHTML={{ __html: cv.content }} />
          )}
          

          {/* Grid container for CV sections */}
          <div className="space-y-8">
            {cv && cv.sections && cv.sections.map((section, index) => (
              <div key={index} className="mb-10">
                <p className="text-base font-serif mb-2">{section.title}</p>
                {section.items && section.items.length > 0 ? (
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-6 gap-1">
                        <div className="text-base font-serif md:col-span-1 md:pl-6">{item.year}</div>
                        <div className="text-base md:col-span-5" dangerouslySetInnerHTML={{ __html: item.content }} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}