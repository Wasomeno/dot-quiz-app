import { useAuth0 } from "@auth0/auth0-react";
import { Question } from "../views/quiz-room";

type QuizStorageData = {
  category?: { id: string; name: string };
  answers?: string[];
  questionIndex?: number;
  questions?: Question[];
  timer?: number;
};

export function useQuizStorage() {
  const authSession = useAuth0();

  const quizStorageData: QuizStorageData = JSON.parse(
    localStorage.getItem(authSession.user?.email as string) as string,
  );

  function setQuizStorageData(quizData: QuizStorageData) {
    const newStorageData = quizData;
    localStorage.setItem(
      authSession.user?.email as string,
      JSON.stringify(newStorageData),
    );
  }

  function removeQuizStorageData() {
    localStorage.removeItem(authSession.user?.email as string);
  }

  return {
    isQuizStorageDataExist: quizStorageData !== null,
    data: quizStorageData as QuizStorageData,
    setQuizStorageData,
    removeQuizStorageData,
  };
}
