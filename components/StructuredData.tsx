/**
 * StructuredData Component
 * Renders JSON-LD structured data as <script> tags in the page head
 * Used for SEO and rich snippets
 */

interface StructuredDataProps {
  schema: Record<string, unknown>;
  id?: string;
}

export function StructuredData({ schema, id }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
