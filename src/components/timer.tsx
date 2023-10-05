import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useQuizStorage } from "../hooks/useQuizStorage";

export function Timer() {
  const { data, setQuizStorageData, isQuizStorageDataExist } = useQuizStorage();
  const [timerCount, setTimerCount] = useState<number>(data?.timer ?? 180);

  const timerIntervalRef = useRef<number>();

  const navigate = useNavigate();

  useEffect(() => {
    if (timerCount === -1) {
      navigate(`${location.pathname}?finished=true`);
    } else {
      timerIntervalRef.current = setInterval(
        () => setTimerCount((currentTimer) => currentTimer - 1),
        1000,
      );
    }
    if (isQuizStorageDataExist) {
      setQuizStorageData({ ...data, timer: timerCount });
    }
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [timerCount]);

  return (
    <div className="text-sm lg:text-base">
      {`0${(timerCount / 60).toString()[0]}`} :
      {(timerCount % 60).toString().length < 2
        ? `0${(timerCount % 60).toString()}`
        : (timerCount % 60).toString()}
    </div>
  );
}
