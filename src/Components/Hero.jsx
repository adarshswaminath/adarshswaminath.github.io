import React from 'react'
import profile from "./assets/profile.png"

function Hero() {
    return (
        <div>
            <section className="bg-white h-screen">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="lg:mt-0 lg:col-span-5 lg:flex mb-2">
                        <img src={profile} alt="mockup" className='rounded-full border-2 border-blue-500 ' />
                    </div>
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl ">Hi Iam Adarsh</h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">Enthusiastic Solidity developer with a foundational understanding of blockchain technology and a desire to apply skills towards building secure and innovative smart contract solutions</p>
                        <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 bg-blue-600 text-white">
                            Speak to Sales
                        </a>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Hero