import dayjs from "dayjs";

export const formatShortTime = (date: string) => {
  const now = dayjs();

  const seconds = now.diff(date, "second");
  if (seconds < 60) return `${seconds}s`;

  const minutes = now.diff(date, "minute");
  if (minutes < 60) return `${minutes}m`;

  const hours = now.diff(date, "hour");
  if (hours < 24) return `${hours}h`;

  const days = now.diff(date, "day");
  if (days < 30) return `${days}d`;

  const months = now.diff(date, "month");
  if (months < 12) return `${months}mo`;

  const years = now.diff(date, "year");
  return `${years}y`;
};

export const formatMessageTime = (date: string | Date) => {
  const d = new Date(date);
  const now = new Date();

  const isSameYear = d.getFullYear() === now.getFullYear();

  const isToday = d.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = d.toDateString() === yesterday.toDateString();

  const weekdays = [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return time;
  }

  if (isYesterday) {
    return `Hôm qua, ${time}`;
  }

  const weekday = weekdays[d.getDay()];

  // Trong tuần hiện tại
  const diffDay = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDay < 7) {
    return `${weekday}, ${time}`;
  }

  if (isSameYear) {
    return `${d.getDate()} tháng ${d.getMonth() + 1}, ${time}`;
  }

  return `${d.getDate()} tháng ${
    d.getMonth() + 1
  }, ${d.getFullYear()}, ${time}`;
};
