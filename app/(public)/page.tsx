import { Hero } from '@/components/marketing/Hero';
import { USPRow } from '@/components/marketing/USPRow';
import { ServicesGrid } from '@/components/marketing/ServicesGrid';
import { ProjectsPreview } from '@/components/marketing/ProjectsPreview';
import { ReviewsRow } from '@/components/marketing/ReviewsRow';
import { CtaSection } from '@/components/marketing/CtaSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <USPRow />
      <ServicesGrid />
      <ProjectsPreview />
      <ReviewsRow />
      <CtaSection />
    </>
  );
}
