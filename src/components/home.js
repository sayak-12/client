import { Link } from "react-router-dom";
import Home1 from "../assests/dandiyalogo.png";
import "./home.css";
import Navbar from "./navbar";
import Foot from "./footer";
import Home3 from "../assests/fronpic.jpg";
import Crousel from "./slider.js";

export default function Home() {
  return (
    <div className="h-[100vh] flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center" style={{marginTop:"2em", marginBottom:"2em"}}>
            <img
              className="object-cover object-center rounded imageee"
              alt="hero"
              src={Home3}
            />
          <div className="lg:flex-grow md:w-1/2 lg:pl-6 md:pl-5 mt-4 flex flex-col  md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-center text-3xl mb-4 font-medium text-gray-900">
              Taaza Dandiya 2024
            </h1>
            <p className="mb-4 leading-relaxed text-center">
              Taaza Dandiya 2024 - Celebrate 15 Years of Dance, Music, & Fun |
              Navratri 2024
            </p>
            <div className="flex justify-center">
              <Link to="/get-tickets">
                <button className="inline-flex text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-lg">
                  Book Tickets
                </button>
              </Link>
            </div>
          </div>
        </div>
        <img src={Home1} alt="home" className="relative  hero-sec imageee" />
      </section>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row-reverse flex-col items-center" style={{marginTop:"2em", marginBottom:"2em", gap:"30px"}}>
        <Crousel />
          <div className="lg:flex-grow md:w-1/2 lg:pl-6 md:pl-5 mt-4 flex flex-col  md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-center text-3xl mb-4 font-medium text-gray-900">
            Event Details
            </h1>
            <p className="mb-4 leading-relaxed text-justify">
            Taaza Dandiya 2024 is set to take place from October 10th to 12th
              at the Netaji Indoor Stadium, Kolkata. It promises an
              unforgettable experience, with a lineup that includes sensational
              artists, exciting contests with fantastic prizes, and the biggest
              dance floor in East India. Be part of this grand celebration and
              book your tickets now. Join the rhythm, embrace the culture, and
              get ready to dance your heart out at Taaza Dandiya 2024!
            </p>
            <div className="flex justify-center">
            </div>
          </div>
        </div>
      </section>

      <Foot />
    </div>
  );
}
