import React from "react";
import { Users, CheckCircle, Cloud } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-30 bg-white text-center font-sans max-lg:px-20 max-md:px-15">
      {/* Main Heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-5 max-md:text-3xl">
        About <span className="text-green-600">Notes App</span>
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl max-md:text-sm">
        Notes App is a secure, modern note-taking platform that helps
        individuals and teams capture ideas, organize thoughts, and collaborate
        effortlessly.{" "}
      </p>

      {/* Features Section */}
      <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-8 mb-10">
        {/* Feature 1 */}
        <div className="flex flex-col items-center bg-green-50 p-6 rounded-lg shadow hover:shadow-lg transition">
          <CheckCircle className="text-green-600 mb-3" size={40} />
          <h3 className="text-xl font-semibold mb-2 max-md:text-md">
            Organize Ideas
          </h3>
          <p className="text-gray-600 text-center max-md:text-sm">
            Keep all your thoughts, tasks, and projects neatly organized in one
            place.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center bg-green-50 p-6 rounded-lg shadow hover:shadow-lg transition">
          <Users className="text-green-600 mb-3" size={40} />
          <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
          <p className="text-gray-600 text-center max-md:text-sm">
            Work with friends or colleagues in real-time to achieve goals
            faster.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center bg-green-50 p-6 rounded-lg shadow hover:shadow-lg transition">
          <Cloud className="text-green-600 mb-3" size={40} />
          <h3 className="text-xl font-semibold mb-2">Secure Cloud Storage</h3>
          <p className="text-gray-600 text-center max-md:text-sm">
            All your notes are stored securely in the cloud and accessible from
            any device.
          </p>
        </div>
      </div>

      {/* Call-to-Action */}
      <button className="px-8 py-3 text-white bg-green-600 rounded-md text-[16px] font-semibold hover:bg-green-700 transition max-md:text-sm">
        Get Started
      </button>
    </div>
  );
};

export default About;
