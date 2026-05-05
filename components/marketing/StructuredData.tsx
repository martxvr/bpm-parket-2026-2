type Props = {
  schema: Record<string, unknown> | Record<string, unknown>[];
};

export function StructuredData({ schema }: Props) {
  // JSON-LD content is fully server-controlled (companyConfig + Supabase rows
  // validated via Zod). type=application/ld+json is non-executable; values
  // are JSON.stringify-escaped before insertion.
  const html = { __html: JSON.stringify(schema) };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={html}
    />
  );
}
