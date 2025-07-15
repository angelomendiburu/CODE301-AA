"use client";

import {
  AnimatePresence,
  motion
} from "framer-motion";
import {
  gradient
} from "@/components/Gradient";
import {
  useEffect,
  useState
} from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    gradient.initGradient("#gradient-canvas");
  }, []);

  const handleOpenModal = (type: 'signin' | 'signup') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const SignInModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative"
    >
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>        <button
          onClick={() => signIn('google')}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-75"
        >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#1E2B3A] text-white rounded-lg px-4 py-2 hover:bg-[#0D2247] transition-colors duration-75"
        >
          Sign In
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={() => handleOpenModal('signup')}
          className="text-[#ff2d5b] hover:text-[#ff1f4f] font-semibold"
        >
          Sign Up
        </button>
      </p>

      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );

  const SignUpModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative"
    >
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>        <button
          onClick={() => signIn('google')}
          className="w-full mb-6 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-75"
        >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
        </div>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Apellido"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <input
            type="tel"
            placeholder="Número de celular"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Crear contraseña"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff2d5b] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ff2d5b] text-white rounded-lg px-4 py-2 hover:bg-[#ff1f4f] transition-colors duration-75"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => handleOpenModal('signin')}
          className="text-[#ff2d5b] hover:text-[#ff1f4f] font-semibold"
        >
          Sign In
        </button>
      </p>

      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <div className="min-h-[100vh] sm:min-h-screen w-screen flex flex-col relative bg-[#F2F3F5] font-inter overflow-hidden">
        <svg
          style={{
            filter: "contrast(125%) brightness(110%)"
          }}
          className="fixed z-[1] w-full h-full opacity-[35%]"
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".7"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        <main className="flex flex-col justify-center h-[90%] static md:fixed w-screen overflow-hidden grid-rows-[1fr_repeat(3,auto)_1fr] z-[100] pt-[30px] pb-[320px] px-4 md:px-20 md:py-0">
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1]
            }}
            className="block row-start-2 mb-8 md:mb-6"
          >
            <div className="flex items-center">
              <div className="text-4xl font-bold tracking-tight">
                Start
                <span className="text-[#FF0066]">UPC</span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1]
            }}
            className="relative md:ml-[-10px] md:mb-[37px] font-extrabold text-[16vw] md:text-[130px] font-inter text-[#1E2B3A] leading-[0.9] tracking-[-2px] z-[100]"
          >
            Startups peruanas, incubadora de{" "}
            <span className="text-[#ff2d5b]" style={{
              textShadow: '2px 2px 4px rgba(30, 43, 58, 0.5)'
            }}>negocios</span>
            <span className="font-inter text-[#ff2d5b]">.</span>
          </motion.h1>
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1]
            }}
            className="flex flex-row justify-center z-20 mx-0 mb-0 mt-8 md:mt-0 md:mb-[35px] max-w-2xl md:space-x-8"
          >
            <div className="w-1/2">
              <h2 className="flex items-center font-semibold text-[1em] text-[#1a2b3b]">
                Platforma
              </h2>
              <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal">
                Estrategias de financiamiento determinantes para la internacionalización de startups peruanas
              </p>
            </div>
            <div className="w-1/2">
              <h2 className="flex items-center font-semibold text-[1em] text-[#1a2b3b]">
                Community
              </h2>
              <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal">
                Registra tu emprendimiento y accede a todos los beneficios de nuestra plataforma.
              </p>
            </div>
          </motion.div>

          <div className="flex gap-[15px] mt-8 md:mt-0">
            <motion.div
              initial={{
                opacity: 0,
                y: 40
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.55,
                duration: 0.55,
                ease: [0.075, 0.82, 0.965, 1]
              }}
            >
              <button
                onClick={() => handleOpenModal('signin')}
                className="group rounded-full pl-[8px] min-w-[120px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#0D2247] no-underline active:scale-95 scale-100 duration-75"
                style={{
                  boxShadow: "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)"
                }}
              >
                <span className="mr-2">Sign In</span>
              </button>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: 40
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.65,
                duration: 0.55,
                ease: [0.075, 0.82, 0.965, 1]
              }}
            >
              <button
                onClick={() => handleOpenModal('signup')}
                className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#ff2d5b] text-white hover:bg-[#ff1f4f] no-underline active:scale-95 scale-100 duration-75"
                style={{
                  boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724"
                }}
              >
                <span className="mr-2">Sign Up</span>
              </button>
            </motion.div>
          </div>
        </main>

        <div
          className="fixed top-0 right-0 w-[80%] md:w-1/2 h-screen bg-[#1F2B3A]/20"
          style={{
            clipPath:
              "polygon(100px 0,100% 0,calc(100% + 225px) 100%, 480px 100%)"
          }}
        ></div>

        <motion.canvas
          initial={{
            filter: "blur(20px)"
          }}
          animate={{
            filter: "blur(0px)"
          }}
          transition={{
            duration: 1,
            ease: [0.075, 0.82, 0.965, 1]
          }}
          style={{
            clipPath:
              "polygon(100px 0,100% 0,calc(100% + 225px) 100%, 480px 100%)"
          }}
          id="gradient-canvas"
          data-transition-in
          className="z-50 fixed top-0 right-[-2px] w-[80%] md:w-1/2 h-screen bg-[#c3e4ff]"
        ></motion.canvas>

        <div className="h-[60px] bg-[#1D2B3A] fixed bottom-0 z-20 w-full flex flex-row items-center justify-center">
          <p className="text-white/80 text-base md:text-lg font-semibold md:leading-[60px] whitespace-nowrap flex flex-row">
            Start UPC
          </p>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
            {modalType === 'signin' ? <SignInModal /> : <SignUpModal />}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
