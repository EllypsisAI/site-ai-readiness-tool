import { useEffect, useState, useRef, RefObject } from 'react';

interface ScrollProgress {
  progress: number;          // 0-1 representing scroll through container
  activeSection: number;     // 0-5 for the 6 sections
  isInView: boolean;         // Whether container is in viewport
  scrollY: number;           // Current scroll position
}

export function useScrollProgress(
  containerRef: RefObject<HTMLElement>,
  sectionCount: number = 6
): ScrollProgress {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate how far we've scrolled into the container
      // Start when top of container hits bottom of viewport
      // End when bottom of container hits top of viewport
      const scrollableDistance = containerHeight + windowHeight;
      const scrolled = windowHeight - containerTop;

      const rawProgress = scrolled / scrollableDistance;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setProgress(clampedProgress);
      setScrollY(window.scrollY);

      // Determine active section (0 to sectionCount-1)
      const sectionProgress = clampedProgress * sectionCount;
      const section = Math.min(Math.floor(sectionProgress), sectionCount - 1);
      setActiveSection(Math.max(0, section));

      // Check if container is in view
      const inView = containerTop < windowHeight && containerTop + containerHeight > 0;
      setIsInView(inView);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef, sectionCount]);

  return { progress, activeSection, isInView, scrollY };
}

// Hook for individual section visibility
export function useSectionVisibility(
  sectionRef: RefObject<HTMLElement>,
  threshold: number = 0.3
): { isVisible: boolean; visibilityProgress: number } {
  const [isVisible, setIsVisible] = useState(false);
  const [visibilityProgress, setVisibilityProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        setVisibilityProgress(entry.intersectionRatio);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [sectionRef, threshold]);

  return { isVisible, visibilityProgress };
}
