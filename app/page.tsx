import ContactSection from "./components/contact/ContactSection";
import Footer from "./components/footer/Footer";
import HeroSection from "./components/hero/HeroSection";
import HowItWorks from "./components/how-it-works/HowItWorks";
import Navbar from "./components/navbar/navbar";
import WhyChooseUs from "./components/why-chose-us/WhyChoseUs";

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
