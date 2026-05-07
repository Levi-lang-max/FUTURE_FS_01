const projects = [
  {
    title: "Personal Portfolio Website",
    description:
      "A responsive portfolio website built using HTML, CSS, and JavaScript — clean layout, smooth interactions, and mobile-first design.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "School Portal Website",
    description:
      "A Firebase-based school portal system featuring secure login functionality and role-aware dashboards for students and staff.",
    tags: ["Firebase", "Auth", "Web App"],
  },
  {
    title: "EcoMars Human Habitat Initiative",
    description:
      "A futuristic Mars orbit city concept called Vulcan City — exploring sustainable habitats beyond Earth.",
    tags: ["Concept", "Research"],
  },
  {
    title: "Space Junk Cleaner Project",
    description:
      "Designed for the GFSSM competition, focused on practical orbital debris cleaning solutions for a safer near-Earth environment.",
    tags: ["GFSSM", "Engineering"],
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-28 px-6 border-t border-border/60">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Selected work
          </p>
          <h2 className="font-display text-4xl sm:text-5xl">
            Projects I'm proud of.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((p) => (
            <article
              key={p.title}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)] transition-all duration-300"
            >
              <h3 className="font-display text-2xl mb-3 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {p.description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
