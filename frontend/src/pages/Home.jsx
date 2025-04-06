import React from 'react'
import Hero from '../components/Hero'
import LatestColleciton from '../components/LatestColleciton'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewletterBox from '../components/NewletterBox'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestColleciton/>
      <BestSeller/>
      <OurPolicy/>
      <NewletterBox/>
    </div>
  )
}

export default Home