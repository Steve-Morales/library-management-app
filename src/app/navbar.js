import { useState } from "react";
import Link from "next/link";

export default function Navbar ()
{
    const [isOpen, setIsOpen] = useState(false);
    return(
        <nav className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Brand</h1>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            <li className="hover:text-gray-400 cursor-pointer">
                <Link href={"/"}>Home</Link>
            </li>
            <li className="hover:text-gray-400 cursor-pointer">
                <Link href={"/people"}>People</Link>
            </li>
            <li className="hover:text-gray-400 cursor-pointer">
                <Link href={"/checkout"}>Checkouts</Link>
            </li>
          </ul>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <span>&#10005;</span> : <span>&#9776;</span>}
          </button>
        </div>
  
        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden bg-gray-800 text-white p-4 space-y-4">
            <li className="hover:text-gray-400 cursor-pointer">
                <Link href={"/"}>Home</Link>
            </li>
            <li className="hover:text-gray-400 cursor-pointer">
                <Link href={"/people"}>People</Link>
            </li>
            <li className="hover:text-gray-400 cursor-pointer">
                <Link href={"/checkout"}>Checkouts</Link>
            </li>
          </ul>
        )}
      </nav>
    );
}