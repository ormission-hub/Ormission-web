import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  noAnimation?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("w-full py-4 sm:py-6", className)}>
      <div className="container-main">{children}</div>
    </section>
  );
}
