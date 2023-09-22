import { useAuth0 } from "@auth0/auth0-react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export function QuizFinishedDialog() {
  const authSession = useAuth0();
  const navigate = useNavigate();

  const userQuizData = JSON.parse(
    localStorage.getItem(authSession.user?.email as string) as string,
  );

  return createPortal(
    <>
      <div className="absolute left-0 top-0 z-10 h-screen w-screen bg-slate-800 bg-opacity-50 backdrop-blur-sm" />
      <dialog
        open
        className="absolute bottom-0 z-20 flex h-5/6 w-full flex-1 flex-col items-center gap-4 rounded-lg bg-slate-50 p-6  lg:bottom-1/2 lg:h-4/6 lg:w-2/6 lg:translate-y-1/2"
      >
        {authSession.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-medium">Getting Your Result...</span>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col items-center justify-center gap-6">
              <span className="text-base font-medium lg:text-lg">
                Congrats you just finished the quiz!
              </span>
              <div className="flex flex-col items-center gap-2">
                <span>You got</span>
                <div className="flex items-center gap-4">
                  <div className="space-y-2 text-center">
                    <div className="text-xl font-semibold">
                      {userQuizData.result.answered} / 10
                    </div>
                    <div>Answered</div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-xl font-semibold">
                      {userQuizData.result.correct} /{" "}
                      {userQuizData.result.answered}
                    </div>
                    <div>Correct</div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-xl font-semibold">
                      {userQuizData.result.wrong} /{" "}
                      {userQuizData.result.answered}
                    </div>
                    <div>Wrong</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  localStorage.removeItem(authSession.user?.email as string);
                  navigate("/quiz");
                }}
                className="w-52 rounded-lg border-2 py-2 text-sm font-medium transition  duration-200 lg:text-base lg:hover:scale-105 lg:hover:bg-slate-900 lg:hover:text-white"
              >
                Take Another Quiz
              </button>
            </div>
          </>
        )}
      </dialog>
    </>,
    document.querySelector("#modal-cotainer") as HTMLElement,
  );
}
