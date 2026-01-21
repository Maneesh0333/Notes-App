import React from "react";
import { CheckSquare, Users, Cloud, Shield, Sparkles, PenTool } from "lucide-react";

const features = [
  {
    icon: <PenTool className="text-green-600 mb-3" size={40} />,
    title: "Smart Note Editor",
    desc: "Write, format, and highlight your notes with an intuitive and distraction-free editor."
  },
  {
    icon: <Users className="text-green-600 mb-3" size={40} />,
    title: "Team Collaboration",
    desc: "Share notes and collaborate with teammates in real-time."
  },
  {
    icon: <Cloud className="text-green-600 mb-3" size={40} />,
    title: "Cloud Sync",
    desc: "Automatically sync your notes across devices for easy access anywhere."
  }
];

const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-30 bg-white text-center font-sans max-lg:px-20 max-md:px-15">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-5 max-md:text-3xl">
        Explore <span className="text-green-600">Features</span>
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl max-md:text-sm">
        Discover everything Notes App offers to help you stay productive, organized, and inspired.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2 text-gray-800 max-md:text-md">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-center max-md:text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="mt-12 px-8 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition max-md:text-sm">
        Start Using Notes App
      </button>
    </div>
  );
};

export default Features;
