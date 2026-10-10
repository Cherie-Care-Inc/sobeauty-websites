import { createFileRoute } from "@tanstack/react-router";
import content from "@/content";
import layout from "@/layout";
import { useSite } from "./__root";

const { brand } = content;

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: content.seo[brand.defaultLang].title },
      { name: "description", content: content.seo[brand.defaultLang].description },
      { property: "og:title", content: content.seo[brand.defaultLang].title },
      { property: "og:description", content: content.seo[brand.defaultLang].description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function HomePage() {
  const { data, setLang } = useSite();
  const Home = layout.Home;
  return <Home data={data} setLang={setLang} />;
}
