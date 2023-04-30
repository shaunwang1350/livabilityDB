export function isInvalidZipCodeInput(val) {
  return val === null || val === undefined || !val.match("^\\d{5}$");
}

export function isInvalidBusinessCategory(val) {
  return val === null || val === undefined || val === "";
}

export function asianDataCheck(asianData) {
  console.log("asianData log:" + asianData);
  for (var i = 0; i < asianData.length; i++) {
    console.log("asianCat log:" + asianData[i].value);
    if (asianData[i].value !== null && asianData[i].value !== undefined && asianData[i].value !== 0) {
      return true; 
    }
  }
  return false;
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