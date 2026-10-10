import { createFileRoute } from "@tanstack/react-router";
import content from "@/content";
import layout from "@/layout";
import { useSite } from "./__root";

const { brand } = content;
const seo = content.seoPages[brand.defaultLang].contact;

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const { data, setLang } = useSite();
  const Contact = layout.Contact;
  return <Contact data={data} setLang={setLang} />;
}
