import { useState, useEffect } from 'react';

export default function Countdown({ endDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, [endDate]);

  const { days, hours, minutes } = timeLeft;

  if (new Date(endDate) < new Date()) {
    return null; // 세일이 종료되면 아무것도 표시하지 않음
  }

  return (
    <span style={{ color: 'red', marginLeft: '10px' }}>
      (종료까지
      {days > 0 && ` ${days}일`}
      {hours > 0 && ` ${hours}시간`}
      {minutes > 0 && ` ${minutes}분`}
      남음)
    </span>
  );
}
