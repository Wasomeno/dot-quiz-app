import { Link } from "react-router-dom";
import { useQuizStorage } from "../hooks/useQuizStorage";

export function SessionExistAlertModal() {
  const { data, removeQuizStorageData } = useQuizStorage();
  return (
    <>
      <div className="absolute left-0 top-0 z-10 h-screen w-screen bg-slate-800 bg-opacity-50 backdrop-blur-sm" />
      <dialog
        open
        className="absolute bottom-0 z-20 flex h-5/6 w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-slate-50 p-6 lg:bottom-1/2 lg:h-4/6 lg:w-2/6 lg:translate-y-1/2"
      >
        <div className="flex flex-1 flex-col justify-center gap-4">
          <span className="text-base font-medium lg:text-lg">
            You still have an active Quiz Session
          </span>
          <div className="space-y-2 text-center">
            <div className="font-medium lg:text-lg">{data.category?.name}</div>
            <div className="text-sm font-medium lg:text-base">
              {!data.timer && "03 : 00 left"}

              {data.timer &&
                data.answers?.length !== data.questions?.length &&
                `0${((data?.timer as number) / 60).toString()[0]} : ${
                  ((data?.timer as number) % 60).toString().length < 2
                    ? `0${((data?.timer as number) % 60).toString()}`
                    : ((data?.timer as number) % 60).toString()
                } Left`}

              {data.timer &&
                data.answers?.length === data.questions?.length &&
                "Finished"}
            </div>
            <div className="text-sm font-medium lg:text-base">
              {data?.answers?.length} / 10 Answered
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to={`/quiz/${data?.category?.id}`}>
            <button className="w-40 rounded-md bg-green-700 py-2 text-sm font-medium text-white transition duration-200 lg:hover:bg-green-700/90">
              Continue
            </button>
          </Link>
          <button
            onClick={() => {
              removeQuizStorageData();
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
