import ContactSection from "./_components/ContactSection";
import Footer from "./_components/Footer";
import HeroSection from "./_components/HeroSection";
import HowItWorks from "./_components/HowItWorks";
import Navbar from "./_components/navbar";
import WhyChooseUs from "./_components/WhyChoseUs";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
      <ContactSection />
      <Footer />
    </>
  );
}
