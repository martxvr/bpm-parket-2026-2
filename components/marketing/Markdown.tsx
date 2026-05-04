import ReactMarkdown from 'react-markdown';

/**
 * Renders Supabase-stored markdown via react-markdown with a strict
 * allowed-component map. Any tag not in this map is silently dropped.
 * Raw HTML in the source is NOT supported (no rehype-raw).
 */
const COMPONENTS = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="heading-display text-3xl mt-8 mb-3" {...p} />
  ),
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="heading-display text-2xl mt-8 mb-2" {...p} />
  ),
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-semibold text-lg mt-6 mb-2" {...p} />
  ),
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="font-semibold mt-4 mb-2" {...p} />
  ),
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 leading-relaxed" {...p} />
  ),
  a: ({ href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-brand-primary)] underline hover:text-[var(--color-brand-primary-dark)]"
      {...rest}
    />
  ),
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-5 my-3 space-y-1" {...p} />
  ),
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-5 my-3 space-y-1" {...p} />
  ),
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li {...p} />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...p} />
  ),
  em: (p: React.HTMLAttributes<HTMLElement>) => <em {...p} />,
  code: (p: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-black/5 px-1 rounded text-sm" {...p} />
  ),
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-black/10 pl-4 italic my-4" {...p} />
  ),
  hr: () => <hr className="my-6 border-black/10" />,
};

export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={COMPONENTS}>{children}</ReactMarkdown>;
}
