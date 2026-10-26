import Portfolio from "@/components/Portfolio";
import { en } from "@/content/site";
import { personJsonLd } from "@/content/meta";

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(en)) }} />
      <Portfolio d={en} />
    </>
  );
}
