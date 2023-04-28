export function formatDuration(sec) {
  const date = new Date(0);
  date.setSeconds(sec ?? 0);
  return date.toISOString().substring(14, 19);
}

export function formatReleaseDate(date) {
  const dateObj = new Date(Date.parse(date));
  return dateObj.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function nonNullVal(val) {
  return val ?? "N/A";
}

export function nullZero(val) {
  return val ?? 0;
}

export function roundDecimals(val) {
  return Math.round((val) * 100) / 100;
}

export function formatBoolean(val) {
  return val ? "Yes" : "No";
}

export function formatScore(val) {
  if (val === null) {
    return "N/A";
  }

  return String(val) + " / 5";
}

export function calcCombinedScore(businessScoreWeight, businessScore, 
                                  housingScoreWeight, housingScore, 
                                  economicsScoreWeight, economicsScore, 
                                  socioDemoScoreWeight, socioDemoScore) {
  return businessScoreWeight * nullZero(businessScore) +
         housingScoreWeight * nullZero(housingScore) +
         economicsScoreWeight * nullZero(economicsScore) +
         socioDemoScoreWeight * nullZero(socioDemoScore);
}