import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/** Renders a Lexical rich-text field from the CMS with the site's typography (.prose-dj). */
export default function RichTextView({ data, className = "" }: { data: unknown; className?: string }) {
  if (!data || typeof data !== "object" || !("root" in data)) return null;
  return <RichText data={data as SerializedEditorState} className={`prose-dj ${className}`} />;
}
