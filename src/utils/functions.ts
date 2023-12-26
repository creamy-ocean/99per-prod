export const changeTabName = (tab: string) => {
  switch (tab) {
    case "친구":
      return "friends";
    case "파티":
      return "parties";
    case "길드":
      return "guilds";
    case "friends":
      return "친구";
    case "parties":
      return "파티";
    case "guilds":
      return "길드";
    default:
      return "";
  }
};

export const isArrayEmpty = (array: Array<any>) => {
  return array.length > 0 ? false : true;
};
