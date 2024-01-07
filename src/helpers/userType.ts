export const checkUserTypeIsValid = (data: any) => {
  const userType = data?.toString();

  if (userType && userType != "customer" && userType != "bartender") {
    return false;
  }
  return true;
};
