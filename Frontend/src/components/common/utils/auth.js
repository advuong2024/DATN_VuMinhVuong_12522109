export const getUser = () => {
  return JSON.parse(
    localStorage.getItem("user")
  );
};

export const hasRole = (...roles) => {
  const user = getUser();

  if (!user) return false;

  return roles.includes(user.vai_tro);
};