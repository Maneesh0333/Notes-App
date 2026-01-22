import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-9 py-5 px-30 bg-green-50 text-center font-sans max-lg:px-20 max-md:px-15">
      <h1 className="text-4xl font-bold text-gray-900 mb-5 max-md:text-3xl">
        Your thoughts,{" "}
        <span className="text-green-600">organized and accessible</span> <br />
        everywhere
      </h1>
      <p className="text-lg text-gray-600 mb-7 max-w-xl max-md:text-sm">
        Capture ideas, organize thoughts, and collaborate seamlessly. The modern
        note-taking app that grows with you and keeps your ideas secure in the
        cloud.
      </p>
      <div className="flex gap-4 mb-5 max-sm:flex-col">
        <Link to="/create-notes"  className="flex flex-row  items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition font-semibold max-md:text-sm">
          Start Taking Notes <ArrowRight size={20} />
        </Link>

        <button className="px-6 py-3 text-green-600 bg-white border-1 rounded-md hover:bg-green-100 border-green-300 transition font-semibold max-md:text-sm">
          Watch Demo
        </button>
      </div>
    </div>
  );
};

export default Home;
