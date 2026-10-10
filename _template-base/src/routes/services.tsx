import { createFileRoute } from "@tanstack/react-router";
import content from "@/content";
import layout from "@/layout";
import { useSite } from "./__root";

const { brand } = content;
const seo = content.seoPages[brand.defaultLang].services;

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

function ServicesPage() {
  const { data, setLang } = useSite();
  const Services = layout.Services;
  return <Services data={data} setLang={setLang} />;
}
