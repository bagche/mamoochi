import { DateTime } from "luxon";

export const formatDateTime = (inputDate: string) => {
  const { locale } = useI18n();

  if (locale.value == "fa") {
    return DateTime.fromISO(inputDate)
      .reconfigure({ outputCalendar: "persian" })
      .setLocale("fa")
      .toFormat("dd MMM yyyy");
  } else {
    return DateTime.fromISO(inputDate)
      .reconfigure({ outputCalendar: "iso8601" })
      .setLocale("en")
      .toFormat("dd MMM yyyy");
  }
};

export const formatTimeAgo = (inputDate: string) => {
  const { locale } = useI18n();
  if (locale.value == "fa") {
    return DateTime.fromISO(inputDate)
      .reconfigure({ outputCalendar: "persian" })
      .setLocale("fa")
      .toRelative();
  } else {
    return DateTime.fromISO(inputDate)
      .reconfigure({ outputCalendar: "iso8601" })
      .setLocale("en")
      .toRelative();
  }
};

export const eventFormatTimeAgo = (inputDate: number) => {
  const { locale } = useI18n();
  if (locale.value == "fa") {
    return DateTime.fromMillis(inputDate)
      .reconfigure({ outputCalendar: "persian" })
      .setLocale("fa")
      .toRelative();
  } else {
    return DateTime.fromSeconds(inputDate)
      .reconfigure({ outputCalendar: "iso8601" })
      .setLocale("en")
      .toRelative();
  }
};
