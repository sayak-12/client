/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from "react-router-dom";
import LogoImg from  "../assests/logo.png";
import "./navbar.css"

export default function Navbar(){
    return(
        <header className="text-gray-600 body-font">
  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
      <img src={LogoImg} alt="logo" style={{height:"2em"}} />
    </a>
    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
      <Link className="mr-5 hover:text-gray-900" to="/">Home</Link>
      <Link className="mr-5 hover:text-gray-900" to="/about">About</Link>
    </nav>
    <Link to="/get-tickets">
    <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 hover:text-black rounded text-base mt-4 md:mt-0 bg-pink-500 text-white">Book Tickets
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button></Link>
  </div>
</header>
    )
}
export function Logo(){
    return(
        <img src={LogoImg} alt="logo" className="h-14 object-contain tazza-logo" />
    )
}