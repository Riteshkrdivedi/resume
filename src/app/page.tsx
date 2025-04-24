"use client";

import { useRouter } from "next/navigation";
import { FiUpload, FiBarChart2, FiEdit, FiCheckCircle } from "react-icons/fi";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-orange-400">Optimize</span> Your Resume for{" "}
              <br />
              <span className="text-blue-300">ATS</span> Success
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Get past automated screening systems and land more interviews with
              our human-reviewed resume analysis.
            </p>
            <button
              onClick={() => router.push("/resume-analyzer-form")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              Analyze Your Resume Now
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            How It <span className="text-blue-300">Works</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <FiUpload className="w-8 h-8" />,
                title: "Upload Your Resume",
                desc: "PDF or Word format",
              },
              {
                icon: <FiBarChart2 className="w-8 h-8" />,
                title: "Instant Analysis",
                desc: "We scan for ATS compatibility",
              },
              {
                icon: <FiEdit className="w-8 h-8" />,
                title: "Get Actionable Feedback",
                desc: "See what's working and what's not",
              },
              {
                icon: <FiCheckCircle className="w-8 h-8" />,
                title: "Improve & Succeed",
                desc: "Make changes and land interviews",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 hover:border-orange-400 transition-all"
              >
                <div className="text-orange-400 mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Real <span className="text-blue-300">Results</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah K.",
                role: "Marketing Professional",
                quote:
                  "Went from 0 callbacks to 5 interviews in 2 weeks after using this tool.",
                avatar: "/first.jpg",
              },
              {
                name: "James L.",
                role: "Software Engineer",
                quote:
                  "Identified missing keywords I never would have thought of. Highly recommend!",
                avatar: "/second.jpg",
              },
              {
                name: "Priya M.",
                role: "Financial Analyst",
                quote:
                  "The suggestions helped me tailor my resume perfectly for each application.",
                avatar: "/third.jpg",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-400 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Resume?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Stop getting rejected by bots before a human even sees your
            application.
          </p>
          <button
            onClick={() => router.push("/resume-analyzer-form")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-all"
          >
            Get Started - It&apos;s Free
          </button>
        </div>
      </section>
    </div>
  );
}
