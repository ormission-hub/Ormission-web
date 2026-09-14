import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 lg:mb-10",
        centered && "text-center",
        className
      )}
    >
      <h2 className="heading-2 text-text font-bengali">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-text-muted body-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
