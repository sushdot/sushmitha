import { Shield, Radio, MapPin } from 'lucide-react';

export function Header() {
  return (
    <header className="hero-gradient text-primary-foreground">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-10 h-10" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">BHARAT-GUARDIAN</h1>
              <p className="text-sm text-primary-foreground/70">National Agentic AI Infrastructure Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/5 rounded-lg">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm">Pan-India Coverage</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
              <Radio className="w-4 h-4 text-success animate-pulse" />
              <span className="text-sm font-medium">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
