import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            © 2024 Neuro Lens. All rights reserved.
          </span>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link 
            href="/legal" 
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Legal & Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
