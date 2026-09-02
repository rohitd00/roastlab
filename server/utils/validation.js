const RIOT_ID_REGEX = /^[^#\s]{1,16}#[^#\s]{2,5}$/;

function isValidRiotId(riotId) {
  if (typeof riotId !== "string") return false;
  return RIOT_ID_REGEX.test(riotId.trim());
}

function parseRiotId(riotId) {
  const [gameName, tagLine] = riotId.trim().split("#");
  return { gameName, tagLine };
}

const VALID_REGIONS = ["na", "eu", "ap", "kr"];

function isValidRegion(region) {
  return VALID_REGIONS.includes(region);
}

const VALID_INTENSITIES = ["friendly", "brutal", "nuclear"];

function isValidIntensity(intensity) {
  return VALID_INTENSITIES.includes(intensity);
}

module.exports = {
  isValidRiotId,
  parseRiotId,
  isValidRegion,
  VALID_REGIONS,
  isValidIntensity,
  VALID_INTENSITIES,
};
