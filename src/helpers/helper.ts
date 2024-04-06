import { IDateCalculation } from "interfaces";
import moment from "moment";
import ShortUniqueId from "short-unique-id";

export const searchTermRegex = (searchTerm: string) =>
  new RegExp(searchTerm ?? "", "i");

export const getDateDifference = (
  startingDate: string | Date,
  endingDate?: string | Date
) => {
  if (new Date() < new Date(startingDate)) {
    const passingdDate = moment(startingDate);
    return passingdDate.diff(moment(endingDate), "days") + 1;
  }

  return 0;
};

export function calculateDates(
  data: string,
  setHours?: { hours: number; min?: number; sec?: number; ms?: number }
) :IDateCalculation{
  const oneDayMilliseconds = 24 * 60 * 60 * 1000;

  const dateTime = new Date(data);
  setHours &&
    dateTime.setHours(
      setHours?.hours,
      setHours?.min,
      setHours?.sec,
      setHours?.ms
    );

  const twoWeeksBefore = new Date(dateTime.getTime() - 14 * oneDayMilliseconds);
  const oneWeekBefore = new Date(dateTime.getTime() - 7 * oneDayMilliseconds);
  const threeDaysBefore = new Date(dateTime.getTime() - 3 * oneDayMilliseconds);
  const oneDayBefore = new Date(dateTime.getTime() - 1 * oneDayMilliseconds);

  return {
    twoWeeksBefore,
    oneWeekBefore,
    threeDaysBefore,
    oneDayBefore,
  };
}

export const randomId = () => {
  const { randomUUID } = new ShortUniqueId({ length: 10 });
  return randomUUID();
};
