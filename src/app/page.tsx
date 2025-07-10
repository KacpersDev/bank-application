"use client";
import { useRouter } from "next/navigation"

export default function Home() { 
  const router = useRouter();

  return(
    <div className="grid justify-center mt-[200px] sm:text-center lg:text-left">
      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block xl:inline">Secure Banking</span>{' '}
        <span className="block text-blue-600 xl:inline">Made Simple</span>
      </h1>
      <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
        Experience the future of banking with our secure, fast, and user-friendly platform. 
        Send money instantly, track your transactions, and manage your finances with ease.
      </p>
      <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
        <div className="rounded-md shadow">
          <button 
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-3">
          <button 
            onClick={() => router.push('/register')}
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  ) 
}