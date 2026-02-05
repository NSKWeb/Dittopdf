import { ToolGrid } from '@/components/tool-grid';
import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { Testimonials } from '@/components/testimonials';
import { FAQ } from '@/components/faq';
import { CTA } from '@/components/cta';
import { AdSidebar } from '@/components/ads/ad-sidebar';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Hero />
          <ToolGrid />
          <Features />
          <Testimonials />
          <FAQ />
          <CTA />
        </div>
        <div className="hidden lg:block">
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}