import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import About from "@/components/About";
import WhyUs from "@/components/WhyUs";
import Location from "@/components/Location";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Menu />
        <About />
        <WhyUs />
        <Location />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
