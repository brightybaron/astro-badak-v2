export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    // timeStyle: "short",
  });
  return formatter.format(date);
};
