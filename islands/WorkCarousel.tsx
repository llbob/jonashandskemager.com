import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Work } from "../types/works.ts";

interface WorkCarouselProps {
  work: Work;
  showNavigation?: boolean;
}

export default function WorkCarousel({ work, showNavigation = true }: WorkCarouselProps) {
  const currentImageIndex = useSignal(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const imageLoaded = useSignal(false);
  
  // Calculate total slides (all images in the array)
  const totalSlides = work.images.length;

  const nextSlide = () => {
    imageLoaded.value = false;
    currentImageIndex.value = (currentImageIndex.value + 1) % totalSlides;
  };

  const previousSlide = () => {
    imageLoaded.value = false;
    currentImageIndex.value = (currentImageIndex.value - 1 + totalSlides) % totalSlides;
  };

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        previousSlide();
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        nextSlide();
      }
    };

    carouselRef.current?.addEventListener("keydown", keydownHandler);
    return () => carouselRef.current?.removeEventListener("keydown", keydownHandler);
  }, []);

  // Get current image/slide
  const currentImage = work.images[currentImageIndex.value];
  
  // Check if current slide is a video
  const isShowingVideo = currentImage && currentImage.videoUrl;

  const handleImageLoad = () => {
    imageLoaded.value = true;
  };

  return (
    <div className="relative flex flex-col">
      <div className="relative w-full" ref={carouselRef} tabIndex={0}>
        {!work.images.length ? (
          // No images placeholder
          <div className="flex items-center justify-center h-[280px] sm:h-[400px] bg-gray-100/10">
            <p className="text-gray-400">No images available</p>
          </div>
        ) : isShowingVideo ? (
          // Responsive video container with proper styling
          <div className="relative w-full pb-[56.25%]"> {/* 16:9 aspect ratio */}
            <div 
              className="absolute top-0 left-0 w-full h-full" 
              dangerouslySetInnerHTML={{ 
                __html: currentImage.videoUrl!.replace(
                  /<iframe(.*?)>/g, 
                  '<iframe$1 style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen>'
                ) 
              }} 
            />
          </div>
        ) : (
          // Image container with loading state
          <div className="flex items-center justify-center">
            {/* Loader image that shows until main image is loaded */}
            {!imageLoaded.value && (
              <img 
                src="/assets/loader/loader.jpg" 
                alt="Loading" 
                className="absolute inset-0 w-full h-full object-contain opacity-50"
              />
            )}
            
            {/* The actual image */}
            <img
              src={currentImage.url}
              alt={currentImage.caption || `${work.title} image ${currentImageIndex.value + 1}`}
              className={`max-h-[280px] sm:max-h-[400px] md:max-h-[600px] lg:max-h-[650px] w-full object-contain transition-opacity duration-300 ${
                imageLoaded.value ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
            />
          </div>
        )}

        {/* Navigation buttons */}
        {showNavigation && totalSlides > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4 pointer-events-none">
            <button
              className="p-1 sm:p-2 text-black focus:outline-none transition-colors duration-300 pointer-events-auto"
              onClick={previousSlide}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="p-1 sm:p-2 text-black focus:outline-none transition-colors duration-300 pointer-events-auto"
              onClick={nextSlide}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Image counter below the image */}
      <div className="hidden lg:flex justify-end mt-1">
        <p className="text-xs text-black bg-backgroundColor rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1">
          ({currentImageIndex.value + 1} / {totalSlides})
        </p>
      </div>

      {/* Caption below the counter - show for both images and videos */}
      {currentImage?.caption && (
        <div className="text-black text-center mt-1">
          <p className="text-sm italic">{currentImage.caption}</p>
        </div>
      )}
    </div>
  );
}
