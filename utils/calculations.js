const calculateDistance = (originLat, originLng, destLat, destLng) => {
  const unit = "K";
  const theta = originLng - destLng;
  let dist =
    Math.sin(deg2rad(originLat)) * Math.sin(deg2rad(destLat)) +
    Math.cos(deg2rad(originLat)) *
      Math.cos(deg2rad(destLat)) *
      Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  const miles = dist * 60 * 1.1515;

  if (unit === "K") {
    return roundToTwo(miles * 1.609344);
  } else if (unit === "N") {
    return roundToTwo(miles * 0.8684);
  } else {
    return roundToTwo(miles);
  }
};

const calculateMatchRatio = (userProfile, otherProfile) => {
  console.log("userProfile", otherProfile);
  const userAttributes = {
    relation_goal: [userProfile.relation_goal],
    interest: userProfile.interest.split(","),
    language: userProfile.language.split(","),
    religion: [userProfile.religion],
  };

  const otherAttributes = {
    relation_goal: [otherProfile.relation_goal],
    interest: otherProfile.interest.split(","),
    language: otherProfile.language.split(","),
    religion: [otherProfile.religion],
  };

  let totalAttributes = 0;
  let matchingAttributes = 0;

  for (const key in userAttributes) {
    totalAttributes += new Set([
      ...userAttributes[key],
      ...otherAttributes[key],
    ]).size;
    matchingAttributes += userAttributes[key].filter((value) =>
      otherAttributes[key].includes(value)
    ).length;
  }

  if (totalAttributes === 0) {
    return 0;
  }

  const matchRatio = (matchingAttributes / totalAttributes) * 100;
  return Math.min(roundToTwo(matchRatio), 100);
};

const deg2rad = (deg) => deg * (Math.PI / 180);
const rad2deg = (rad) => rad * (180 / Math.PI);
const roundToTwo = (num) => Math.round(num * 100) / 100;

module.exports = {
  calculateDistance,
  calculateMatchRatio,
};

