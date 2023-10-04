import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export function QuizRoomCounter() {
  const authSession = useAuth0();
  const userQuizData = JSON.parse(
    localStorage.getItem(authSession.user?.email as string) as string,
  );

  const [timerCount, setTimerCount] = useState<number>(
    userQuizData?.timer ?? 180,
  );

  const timerIntervalRef = useRef<number>();

  const navigate = useNavigate();

  useEffect(() => {
    if (timerCount === -1) {
      navigate(`${location.pathname}?finished=true`);
    }

    if (userQuizData) {
      localStorage.setItem(
        authSession.user?.email as string,
        JSON.stringify({ ...userQuizData, timer: timerCount }),
      );
    }

    if (timerCount !== -1) {
      timerIntervalRef.current = setInterval(
        () => setTimerCount((currentTimer) => currentTimer - 1),
        1000,
      );
    }

    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [timerCount]);

  return (
    <div>
      {`0${(timerCount / 60).toString()[0]}`} :
      {(timerCount % 60).toString().length < 2
        ? `0${(timerCount % 60).toString()}`
        : (timerCount % 60).toString()}
    </div>
  );
}
