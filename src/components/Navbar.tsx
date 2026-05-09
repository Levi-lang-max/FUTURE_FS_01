export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="font-display text-lg tracking-tight">
          Abrham<span className="text-primary">.</span>
        </a>
        <ul className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
          <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
          <li><a href="#projects" className="hover:text-foreground transition-colors">Projects</a></li>
          <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
          <li><a href="/crm" className="hover:text-foreground transition-colors">CRM</a></li>
        </ul>
        <a
          href="#contact"
          className="text-sm px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Get in touch
        </a>
      </nav>
    </header>
  );
}
