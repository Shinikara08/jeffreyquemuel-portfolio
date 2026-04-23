import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import FluidCursor from "@/components/FluidCursor";
import FloatingDock from "@/components/FloatingDock";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <StarField />
      <FluidCursor />
      <Hero />
      <TechStack />
      <About />
      <Services />
      <Projects />
      <Experience />
      <Blog />
      <Contact />
      <Footer />
      <FloatingDock />
    </main>
  );
}
