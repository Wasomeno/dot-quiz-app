import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuizStorage } from "../hooks/useQuizStorage";
import { Question } from "../views/quiz-room";

export function QuizFinishedDialog() {
  const { data, removeQuizStorageData } = useQuizStorage();
  const navigate = useNavigate();

  const result = data.answers?.reduce(
    (currentResult, answer, answerIndex) => {
      return answer ===
        (data.questions as Question[])[answerIndex].correct_answer
        ? { ...currentResult, correct: currentResult.correct + 1 }
        : { ...currentResult, wrong: currentResult.wrong + 1 };
    },
    { correct: 0, wrong: 0 },
  );

  const isQuizFinishedValid =
    data.answers?.length === data.questions?.length || data.timer === -1;

  function finishQuiz() {
    removeQuizStorageData();
    navigate("/quiz");
  }

  function backToSession() {
    navigate(`/quiz/${data.category?.id}`);
  }

  return createPortal(
    <>
      <div className="fixed left-0 top-0 z-10 h-screen w-screen bg-slate-800 bg-opacity-50 backdrop-blur-sm" />
      <dialog
        open
        className="fixed bottom-0 z-20 flex h-5/6 w-full flex-1 flex-col items-center gap-4 rounded-lg bg-slate-50 p-6  lg:bottom-1/2 lg:h-4/6 lg:w-2/6 lg:translate-y-1/2"
      >
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <span className="text-base font-medium lg:text-lg">
            {isQuizFinishedValid
              ? `Congrats you just
            finished the quiz!`
              : `You Haven't Finished the Quiz `}
          </span>

          {isQuizFinishedValid ? (
            <div className="grid w-full grid-cols-3 gap-2 lg:gap-4">
              <div className="col-span-1 space-y-2  rounded-lg border px-4 py-2 shadow-sm">
                <div className="text-xs font-medium opacity-50 lg:text-sm">
                  Answered
                </div>
                <div className="text-end font-medium">
                  {data.answers?.length}
                </div>
              </div>
              <div className="col-span-1 space-y-2  rounded-lg border px-4 py-2 shadow-sm">
                <div className="text-xs font-medium opacity-50 lg:text-sm">
                  Correct
                </div>
                <div className="text-end font-medium">{result?.correct}</div>
              </div>
              <div className="col-span-1 space-y-2  rounded-lg border px-4 py-2 shadow-sm">
                <div className="text-xs font-medium opacity-50 lg:text-sm">
                  Wrong
                </div>
                <div className="text-end font-medium">{result?.wrong}</div>
              </div>
            </div>
          ) : null}
        </div>
        <div>
          <button
            onClick={() => {
              isQuizFinishedValid ? finishQuiz() : backToSession();
            }}
            className="w-52 rounded-lg border-2 py-2 text-sm font-medium transition  duration-200 lg:text-base lg:hover:scale-105 lg:hover:bg-slate-900 lg:hover:text-white"
          >
            {isQuizFinishedValid ? "Take Another Quiz " : "Back to Session"}
          </button>
        </div>
      </dialog>
    </>,
    document.querySelector("#modal-cotainer") as HTMLElement,
  );
}
