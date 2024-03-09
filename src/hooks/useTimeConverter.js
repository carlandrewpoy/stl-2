import { parse, format } from "date-fns";

const useTimeConverter = () => {
  const convertTimeToHumanReadable = (timeString) => {
    const parsedTime = parse(timeString, "HH:mm:ss", new Date());
    const formattedTime = format(parsedTime, "h:mm");
    return formattedTime;
  };

  return { convertTimeToHumanReadable };
};

export default useTimeConverter;
