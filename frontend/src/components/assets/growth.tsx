import * as React from "react";
import { gsap } from "@/lib/animations";
import { useGSAP } from "@gsap/react";

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

const GrowthIcon = (props: SvgComponentProps) => {
  const ref = React.useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (ref.current) {
      const paths = ref.current.querySelectorAll("path");

      paths.forEach((path, index) => {
        const pathLength = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          stroke: "currentColor",
          strokeWidth: 1.5,
          fill: "none",
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          delay: index * 0.2,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(path, {
              fill: "currentColor",
              stroke: "none",
              duration: 0.3,
              ease: "power2.out",
            });
          },
        });
      });
      gsap.fromTo(
        ref.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );
    }
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={800}
      ref={ref}
      height={800}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M21.92 6.62a1 1 0 0 0-.54-.54A1 1 0 0 0 21 6h-5a1 1 0 0 0 0 2h2.59L13 13.59l-3.29-3.3a1 1 0 0 0-1.42 0l-6 6a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L9 12.41l3.29 3.3a1 1 0 0 0 1.42 0L20 9.41V12a1 1 0 0 0 2 0V7a1 1 0 0 0-.08-.38Z" />
    </svg>
  );
};
export default GrowthIcon;
