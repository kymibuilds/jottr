import React from "react";
import { Lock, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Lock,
    number: "01",
    title: "End-to-End Encrypted",
    desc: "Your notes are secured with military-grade encryption. Nobody can read them but you—not even us.",
  },
  {
    icon: Zap,
    number: "02",
    title: "Blazingly Fast",
    desc: "Capture thoughts in milliseconds. No lag, no loading screens. Just pure speed when inspiration strikes.",
  },
  {
    icon: Globe,
    number: "03",
    title: "Publish Anywhere",
    desc: "Share your notes with the world. One click to make your ideas publicly accessible to anyone.",
  },
];

function Features() {
  return (
    <div className="w-full py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, index) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="
                  group relative flex flex-col
                  bg-white p-8 rounded-2xl
                  border border-gray-100
                  /* Smooth Hover Effect: Lift + Shadow */
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]
                  hover:border-gray-200
                "
              >
                {/* Header: Number & Icon */}
                <div className="flex items-start justify-between mb-8">
                  <span className="text-sm font-mono font-medium text-gray-300 group-hover:text-gray-900 transition-colors">
                    {f.number}
                  </span>
                  
                  {/* Icon Wrapper */}
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors duration-300">
                    <Icon
                      className="
                        w-6 h-6
                        text-gray-400
                        stroke-[1.5]
                        transition-colors duration-300
                        group-hover:text-blue-600
                      "
                    />
                  </div>
                </div>

                {/* Text Content */}
                <h4 className="text-lg font-bold text-[#2f3437] mb-3">
                  {f.title}
                </h4>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
                
                {/* Decorative bottom gradient line (optional, adds polish) */}
                <div 
                  className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Features;