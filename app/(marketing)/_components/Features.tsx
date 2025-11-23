import React from "react";
import { Lock, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Lock,
    number: "001",
    title: "End-to-End Encrypted",
    desc: "Your notes are secured with military-grade encryption. Nobody can read them but you—not even us.",
  },
  {
    icon: Zap,
    number: "002",
    title: "Blazingly Fast",
    desc: "Capture thoughts in milliseconds. No lag, no loading screens. Just pure speed when inspiration strikes.",
  },
  {
    icon: Globe,
    number: "003",
    title: "Publish Anywhere",
    desc: "Share your notes with the world. One click to make your ideas publicly accessible to anyone.",
  },
];

function Features() {
  return (
    <div className="w-full py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group space-y-4 bg-neutral-50 p-8 rounded-md border border-neutral-100 transition"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs font-mono text-neutral-400">
                    {f.number}
                  </span>
                  <Icon
                    className="
                      w-12 h-12
                      text-neutral-300
                      stroke-[1]
                      transition-transform duration-200
                      group-hover:scale-125
                      group-hover:text-neutral-700
                    "
                  />
                </div>
                <h4 className="text-xl font-semibold text-neutral-900">
                  {f.title}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Features;
