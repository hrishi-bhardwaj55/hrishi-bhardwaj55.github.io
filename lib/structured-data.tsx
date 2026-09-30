import { github, linkedin } from '@/app/projects';
import { siteUrl } from './site-path';

// schema.org data for search engines. Each page embeds what it describes;
// the author is repeated in full because crawlers do not join pages by @id.
export const person = {
  '@type': 'Person',
  name: 'Hrishikesh Bhardwaj',
  jobTitle: 'Software Engineer',
  url: siteUrl('/'),
  sameAs: [github, linkedin],
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'Carnegie Mellon University',
  },
  knowsAbout: ['Java', 'AWS', 'Distributed systems'],
};

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Escaping `<` keeps a stray `</script>` in any string from ending the tag.
  const json = JSON.stringify({ '@context': 'https://schema.org', ...data });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}
