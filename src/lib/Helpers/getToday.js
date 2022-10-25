export const getToday = () => {
  const date = new Date()
  const year = date.getFullYear().toString()
  const month = date.getMonth() < 9 ? `0${(date.getMonth() + 1).toString()}` : (date.getMonth() + 1).toString()

  return {
    yearMonth: `${year}-${month}`,
    year,
    month
  }
}
