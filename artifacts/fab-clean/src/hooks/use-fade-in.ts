import { useEffect, useRef } from "react";

const sharedObserver =
  typeof window !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("fade-visible");
              sharedObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "-50px", threshold: 0.1 }
      )
    : null;

export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && sharedObserver) sharedObserver.observe(ref.current);
    return () => {
      if (ref.current && sharedObserver) sharedObserver.unobserve(ref.current);
    };
  }, []);
  return ref;
}
