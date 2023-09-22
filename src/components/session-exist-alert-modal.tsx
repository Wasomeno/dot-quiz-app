import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export function SessionExistAlertModal() {
  const authSession = useAuth0();
  const userQuizData = JSON.parse(
    localStorage.getItem(authSession.user?.email as string) as string,
  );

  return (
    <>
      <div className="absolute left-0 top-0 z-10 h-screen w-screen bg-slate-800 bg-opacity-50 backdrop-blur-sm" />
      <dialog
        open
        className="absolute bottom-0 z-20 flex h-5/6 w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-slate-50 p-6  lg:bottom-1/2 lg:h-4/6 lg:w-2/6 lg:translate-y-1/2"
      >
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-base font-medium lg:text-lg">
            You still have an active Quiz Session
          </span>
          <div className="space-y-4 text-center">
            <div>{userQuizData.questions[0].category}</div>
            <div className="space-y-2">
              <div className="text-lg font-medium">
                {userQuizData.result.answered !== 10
                  ? `0${(userQuizData.timer / 60).toString()[0]} : ${
                      (userQuizData.timer % 60).toString().length < 2
                        ? `0${(userQuizData.timer % 60).toString()}`
                        : (userQuizData.timer % 60).toString()
                    } Left`
                  : "Finished"}
              </div>
              <div className="text-lg font-medium">
                {userQuizData.result.answered} / 10 Answered
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to={`/quiz/${userQuizData.categoryId}`}>
            <button className="w-40 rounded-md bg-green-700 py-2 text-sm font-medium text-white transition duration-200 lg:hover:bg-green-700/90">
              Continue
            </button>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem(authSession.user?.email as string);
              location.reload();
            }}
            className="w-40 rounded-md bg-red-700 py-2 text-sm font-medium text-white transition duration-200 lg:hover:bg-red-700/90"
          >
            Quit
          </button>
        </div>
      </dialog>
    </>
  );
}
