export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Abrham Belay. All rights reserved.</p>
        <p className="font-display italic">Made with care.</p>
      </div>
    </footer>
  );
}
