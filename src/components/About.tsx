const skills = ["HTML", "CSS", "JavaScript", "Flask", "GitHub"];

export function About() {
  return (
    <section id="about" className="py-28 px-6 border-t border-border/60">
      <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            About
          </p>
          <h2 className="font-display text-4xl sm:text-5xl">
            A student, a builder, a learner.
          </h2>
        </div>
        <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I'm a Grade 11 student from Ethiopia passionate about technology,
            web development, and innovation. I enjoy building websites,
            solving real-world problems, and exploring modern programming
            technologies.
          </p>
          <p>
            I've worked with{" "}
            <span className="text-foreground">
              HTML, CSS, JavaScript, Flask, and GitHub
            </span>
            , and I'm continuously growing my skills through hands-on projects
            and internships.
          </p>
          <ul className="flex flex-wrap gap-2 pt-4">
            {skills.map((skill) => (
              <li
                key={skill}
                className="px-4 py-1.5 rounded-full border border-border bg-card text-sm text-foreground"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
