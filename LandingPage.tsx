import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/landing/Hero';
import { StatsBar } from '@/components/landing/StatsBar';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';

interface Props {
  onNavigate: (page: 'landing' | 'signin' | 'signup') => void;
}

export function LandingPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={onNavigate} />
      <Hero onStartFree={() => onNavigate('signup')} />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Pricing onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
