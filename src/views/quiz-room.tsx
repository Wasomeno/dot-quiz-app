import { useQuery } from "@tanstack/react-query";
import { decode } from "he";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CategoryNotValidScreen } from "../components/category-not-valid-screen";
import { QuizFinishedDialog } from "../components/quiz-finished-dialog";
import { Timer } from "../components/timer";
import { useQuizStorage } from "../hooks/useQuizStorage";

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export function QuizRoomPage() {
  const {
    data: quizStorageData,
    setQuizStorageData,
    isQuizStorageDataExist,
  } = useQuizStorage();

  const [answers, setAnswers] = useState<string[]>(
    quizStorageData?.answers ?? [],
  );
  const [questionIndex, setQuestionIndex] = useState(
    quizStorageData?.questionIndex ?? 0,
  );

  const { categoryId } = useParams() as { categoryId: string };
  const [urlSearchParams] = useSearchParams();

  const isCategoryValid =
    parseInt(categoryId) >= 9 && parseInt(categoryId) <= 18;

  const { data: questionsData, isLoading: isQuestionsLoading } = useQuery<
    Question[]
  >(
    ["questions", categoryId],
    () =>
      fetch(
        `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`,
      )
        .then((response) => response.json())
        .then((response) => response.results),
    {
      enabled: !isQuizStorageDataExist && isCategoryValid,
      refetchOnWindowFocus: false,
    },
  );

  const navigate = useNavigate();

  const questions = quizStorageData?.questions ?? questionsData;
  const activeQuestion = questions && questions[questionIndex];

  const isQuizFinished = urlSearchParams.get("finished") !== null;

  function selectAnswer(answer: string) {
    const currentAnswers = [...answers, answer];
    const currentQuestionIndex = questionIndex + 1;

    if (currentQuestionIndex === questions?.length) {
      navigate(`${location.pathname}?finished=true`);
    }
    setQuizStorageData({
      ...quizStorageData,
      category: {
        id: categoryId,
        name: (questions as Question[])[0].category,
      },
      answers: currentAnswers,
      questionIndex: currentQuestionIndex,
      questions,
    });
    setAnswers(currentAnswers);
    setQuestionIndex(currentQuestionIndex);
  }

  useEffect(() => {
    if (questionIndex === 10) navigate(`${location.pathname}?finished=true`);

    if (isQuizStorageDataExist && categoryId !== quizStorageData?.category?.id)
      navigate(`/quiz`);

    if (!isQuizStorageDataExist && !isQuestionsLoading) {
      setQuizStorageData({
        ...quizStorageData,
        category: {
          id: categoryId,
          name: (questionsData as Question[])[0].category,
        },
        answers,
        questionIndex,
        questions,
      });
    }
  }, [isQuestionsLoading]);

  if (!isCategoryValid) return <CategoryNotValidScreen />;

  if (isQuizFinished) return <QuizFinishedDialog />;

  if (questionIndex === 10 || quizStorageData?.timer === -1) return;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 lg:gap-10">
      {isQuestionsLoading && !isQuizStorageDataExist ? (
        <div className="font-medium">Preparing Questions...</div>
      ) : (
        <>
          <div className="w-5/6 text-center lg:w-3/6">
            <span className="tracking wide text-lg font-semibold lg:text-2xl">
              {decode(activeQuestion?.question as string)}
            </span>
          </div>
          <Timer />
          <div className="grid grid-cols-2 gap-6 px-6">
            {[
              ...(activeQuestion?.incorrect_answers as string[]),
              activeQuestion?.correct_answer,
            ]
              .sort()
              .map((answer, index) => (
                <button
                  onClick={() => selectAnswer(answer as string)}
                  key={index}
                  className="shdadow-sm h-20 w-40 rounded-xl border-2 bg-slate-50 px-4 py-2 text-xs font-medium transition duration-200 lg:w-72 lg:text-base lg:hover:scale-105 lg:hover:border-blue-400 lg:hover:bg-blue-500 lg:hover:text-white lg:hover:shadow-md"
                >
                  {decode(answer as string)}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
