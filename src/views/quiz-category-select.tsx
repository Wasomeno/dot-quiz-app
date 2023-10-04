import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SessionExistAlertModal } from "../components/session-exist-alert-modal";

type Category = {
  id: number;
  name: string;
};

export function QuizCategorySelectPage() {
  const categories = useQuery<Category[]>(["categories"], () =>
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((response) => response.trivia_categories.slice(0, 10)),
  );

  const authSession = useAuth0();
  const isSessionExist = localStorage.getItem(
    authSession.user?.email as string,
  );

  const categorySkeletons = Array(10).fill(
    <div className="relative isolate h-16 w-40 overflow-hidden rounded-lg border bg-gray-300 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent lg:h-20 lg:w-80" />,
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold lg:text-3xl">
          Welcome to the Quiz App!
        </h1>
        <div className="w-72 lg:w-96">
          <span className="text-sm tracking-wide lg:text-base">
            Select one of these categories and the quiz will start immediately
          </span>
        </div>
      </div>
      {categories.isLoading ? (
        <div className="grid grid-cols-2 gap-4 px-6 lg:gap-6">
          {categorySkeletons.map((value) => value)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 px-6 lg:gap-6">
          {categories.data?.map((category) => (
            <Link
              key={category.id}
              to={`/quiz/${category.id}`}
              className="flex h-16 w-40 items-center justify-center rounded-xl bg-blue-500 px-4 text-center text-xs font-medium tracking-wide text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-500/90 lg:h-20 lg:w-80 lg:text-base"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
      {isSessionExist && <SessionExistAlertModal />}
    </div>
  );
}
