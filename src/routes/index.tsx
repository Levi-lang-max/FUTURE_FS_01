import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Navbar } from "../components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Abrham Belay — Full Stack Web Development Intern" },
      {
        name: "description",
        content:
          "Portfolio of Abrham Belay — aspiring software developer from Ethiopia. Projects in web development, Flask, JavaScript, and futuristic engineering concepts.",
      },
      { property: "og:title", content: "Abrham Belay — Full Stack Web Development Intern" },
      {
        property: "og:description",
        content:
          "Aspiring software developer & problem solver. Portfolio, projects, and contact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </>
  );
}
