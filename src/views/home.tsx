import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold lg:text-5xl">
          A Simple Quiz App
          <span className="text-base font-medium text-blue-600 lg:text-lg">
            {" "}
            using React.js
          </span>
        </h1>
        <p className="w-72 text-sm tracking-wide md:text-base lg:w-auto lg:text-lg">
          This is a simple quiz app for my internship application at DOT
        </p>
      </div>
      <Link
        to="/quiz"
        className="w-32 rounded-lg border border-slate-800 px-4 py-2 text-sm font-medium transition duration-200 hover:scale-105 hover:bg-slate-900 hover:text-white lg:w-auto lg:text-base"
      >
        Start Quiz
      </Link>
    </div>
  );
}
