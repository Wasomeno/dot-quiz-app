import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { decode } from "he";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CategoryNotValidScreen } from "../components/category-not-valid-screen";
import { QuizFinishedDialog } from "../components/quiz-finished-dialog";
import { QuizRoomCounter } from "../components/quiz-room-counter";

type Result = {
  answered: number;
  correct: number;
  wrong: number;
};

type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export function QuizRoomPage() {
  const [isFetch, setIsFetch] = useState(false);
  const [storageQuestions, setStorageQuestions] = useState<Question[]>();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState<Result>({
    answered: 0,
    correct: 0,
    wrong: 0,
  });

  const navigate = useNavigate();

  const authSession = useAuth0();
  const { categoryId } = useParams() as { categoryId: string };
  const [urlSearchParams] = useSearchParams();

  const { data: questionsData, isLoading: questionsDataLoading } = useQuery<
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
      enabled: isFetch,
      refetchOnWindowFocus: false,
    },
  );

  const questions = storageQuestions ?? questionsData;
  const activeQuestion = questions && questions[questionIndex];
  const isQuizFinished = urlSearchParams.get("finished") !== null;

  function selectAnswer(answer: string) {
    const currentResult = {
      answered: result.answered + 1,
      correct:
        answer === activeQuestion?.correct_answer
          ? result.correct + 1
          : result.correct,
      wrong:
        answer !== activeQuestion?.correct_answer
          ? result.wrong + 1
          : result.wrong,
    };

    const currentQuestionIndex = questionIndex + 1;

    if (currentQuestionIndex === questions?.length) {
      navigate(`${location.pathname}?finished=true`);
    }

    localStorage.setItem(
      authSession.user?.email as string,
      JSON.stringify({
        questions,
        categoryId,
        result: currentResult,
        questionIndex: currentQuestionIndex,
      }),
    );

    setResult(currentResult);
    setQuestionIndex(currentQuestionIndex);
  }

  useEffect(() => {
    if (authSession.isLoading) return;

    const userQuizDataStorage = localStorage.getItem(
      authSession.user?.email as string,
    );

    if (userQuizDataStorage) {
      const parsed = JSON.parse(userQuizDataStorage);
      setStorageQuestions(parsed.questions);
      setQuestionIndex(parsed.questionIndex);
      setResult(parsed.result);
    }

    if (!userQuizDataStorage) {
      setIsFetch(true);
      if (questionsDataLoading) return;
      localStorage.setItem(
        authSession.user?.email as string,
        JSON.stringify({
          questions,
          result,
          questionIndex,
          categoryId,
        }),
      );
    }
  }, [authSession.isLoading, questionsDataLoading]);

  if (parseInt(categoryId) < 9 || parseInt(categoryId) > 18)
    return <CategoryNotValidScreen />;

  if (questionIndex === 10 || isQuizFinished) return <QuizFinishedDialog />;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 lg:gap-10">
      {questionsDataLoading && !storageQuestions ? (
        <div className="font-medium">Preparing Questions...</div>
      ) : (
        <>
          <div className="w-5/6 text-center lg:w-3/6">
            <span className="tracking wide text-lg font-semibold lg:text-2xl">
              {decode(activeQuestion?.question as string)}
            </span>
          </div>
          <QuizRoomCounter />
          <div className="grid grid-cols-2 gap-6 px-6">
            {[
              ...(activeQuestion?.incorrect_answers as string[]),
              activeQuestion?.correct_answer,
            ].map((answer, index) => (
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
