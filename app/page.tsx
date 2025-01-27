'use client'
import Image from "next/image";

export default function Home() {
  return (
    <button className="px-6 py-2 border border-blue-400 hover:border-blue-600 shadow-md rounded-full m-3 hover:scale-100 transition-all duration-150"  
    onClick={() => alert("Pranesh Got 10 CGPA")}
    >
      Hello Pranesh Asda
    </button>
  );


  /*
  div {
  color : black
  }
  */
}
