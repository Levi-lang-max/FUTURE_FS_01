export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden"
    >
      {/* Decorative blur */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-accent/40 blur-3xl"
      />

      <div className="relative max-w-5xl mx-auto w-full fade-in-up">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-6">
          Full Stack Web Development Intern
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] max-w-3xl">
          Hi, I'm <span className="italic text-primary">Abrham Belay</span>
          <span className="block text-foreground/90 mt-2">
            building the web, one idea at a time.
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Aspiring software developer and problem solver from Ethiopia,
          passionate about technology, web development, and innovation.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full border border-foreground/20 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
