import { IRESPONSE } from "interfaces";

export const handleResponse = ({
  result,
  resRef,
  statusCode,
  errorMessage,
  statusMessage,
  hasError,
}: IRESPONSE) => {
  if (hasError)
    return resRef.status(statusCode ?? 400).json({
      statusCode: statusCode ?? 400,
      result: result ?? null,
      errorMessage: errorMessage ?? "Something Went Wrong",
      statusMessage,
    });

  return resRef.status(statusCode ?? 200).json({
    statusCode: statusCode ?? 200,
    result: result ?? null,
    errorMessage: errorMessage ?? null,
    statusMessage: statusMessage ?? "Data Fetch Successfully",
  });
};
