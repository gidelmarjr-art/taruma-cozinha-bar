import Header from '../../components/Header/Header'
import Hero from '../../components/Hero/Hero'
import About from '../../components/About/About'
import BranchDivider from '../../components/BranchDivider/BranchDivider'
import Menu from '../../components/Menu/Menu'
import Locations from '../../components/Locations/Locations'
import Gallery from '../../components/Gallery/Gallery'
import Testimonials from '../../components/Testimonials/Testimonials'
import CTA from '../../components/CTA/CTA'
import Footer from '../../components/Footer/Footer'

function SitePublico() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <BranchDivider />
        <Menu />
        <Locations />
        <BranchDivider flip />
        <Gallery />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default SitePublico
