import schedule from "node-schedule";
import { getDateDifference, randomId } from "./helper";
import { calculateDates } from "./helper";
import { pushNotification } from "./notification";
import { IDateCalculation } from "interfaces";
import { getUserById } from "../db";

export const scheduleaJob = (
  uniqueKey: string | number,
  scheduledTime: Date,
  job: () => any
) => {
  return schedule.scheduleJob(
    uniqueKey?.toString(),
    scheduledTime,
    function () {
      job();
    }
  );
};

export function cancelScheduleJob(jobId: string | any) {
  const job = schedule.scheduledJobs[jobId?.toString()];
  if (!job) return null;
  job.cancel();
  return true;
}

export const cancelAllScheduleJobForLeftOver = (
  scheduleIds: IDateCalculation
) => {
  if (!scheduleIds) return;
  const jIds = scheduleIds;

  jIds.oneDayBefore && cancelScheduleJob(jIds.oneDayBefore);
  jIds.oneWeekBefore && cancelScheduleJob(jIds.oneWeekBefore);
  jIds.threeDaysBefore && cancelScheduleJob(jIds.threeDaysBefore);
  jIds.twoWeeksBefore && cancelScheduleJob(jIds.twoWeeksBefore);
};

export const schedulerForLeftover = (params: {
  expiryDate: string;
  customerId: string;
  forEdit?: boolean;
  imageUrl?: string;
  brandName?: string;
  scheduleIds?: IDateCalculation;
}): IDateCalculation => {
  const { expiryDate, customerId } = params;

  const dates = calculateDates(expiryDate, {
    hours: 16,
    min: 0,
    ms: 0,
    sec: 0,
  });

  let jobIds: IDateCalculation | any = {
    oneDayBefore: null,
    oneWeekBefore: null,
    threeDaysBefore: null,
    twoWeeksBefore: null,
  };

  const triggertNotification = (
    type: string,
    time: Date | string,
    idRef: string
  ) => {
    const id = randomId();
    jobIds[idRef] = id;
    scheduleaJob(id, new Date(time), async () => {
      const user = await getUserById(customerId);

      pushNotification(
        user?.fcmToken,
        `Your Leftovers will expire in ${type}`,
        `Brand Name ${params?.brandName}`,
        params?.imageUrl
      )
        .then(() => {})
        .catch((err) => {});
    });
  };

  if (params.forEdit && params?.scheduleIds) {
    cancelAllScheduleJobForLeftOver(params.scheduleIds);
  }

  if (getDateDifference(dates.oneDayBefore)) {
    triggertNotification("One Day", dates.oneDayBefore, "oneDayBefore");
  }

  if (getDateDifference(dates.threeDaysBefore)) {
    triggertNotification(
      "Three Days",
      dates.threeDaysBefore,
      "threeDaysBefore"
    );
  }

  if (getDateDifference(dates.oneWeekBefore)) {
    triggertNotification("One Week", dates.oneWeekBefore, "oneWeekBefore");
  }

  if (getDateDifference(dates.twoWeeksBefore)) {
    triggertNotification("Two Week", dates.twoWeeksBefore, "twoWeeksBefore");
  }

  return jobIds;
};
