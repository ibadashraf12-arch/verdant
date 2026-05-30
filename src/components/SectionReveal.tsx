import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
}

/** Plain section wrapper — scroll animations removed. */
export default function SectionReveal({ children, className, id }: Props) {
  return (
    <section
      id={id}
      className={`relative bg-background ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
