import { notFound } from "next/navigation";

/** Any unknown address renders the site's own 404 (inside the language layout). */
export default function CatchAll() {
  notFound();
}
