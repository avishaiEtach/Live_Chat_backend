import CryptoJS from "crypto-js";

export const utilsFunctions = {
  getPagination,
  hashStringWithKey,
  checkForEmptyValues,
  getRandomIntInclusive,
  getRandomHexColor,
};

function getPagination(page: any, limit: any, array: any[]) {
  if (!page || !limit || isNaN(Number(page)) || isNaN(Number(limit))) {
    throw new Error(
      "Invalid page or limit parameters. Please provide numbers."
    );
  }
  const startIndex = (+page - 1) * +limit;
  const endIndex = startIndex + +limit;
  const slicedArray = array.slice(startIndex, endIndex);
  const res = { rows: slicedArray, amount: array.length };
  return res;
}

function hashStringWithKey(string: string) {
  const hashed = CryptoJS.HmacSHA256(
    string,
    process.env.PASSWORD_HASH_KEY as string
  );
  return hashed.toString(CryptoJS.enc.Hex);
}

function checkForEmptyValues(obj: any): { isValid: boolean; key?: string } {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === "") {
      return { isValid: false, key: key };
    }
  }
  return { isValid: true };
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getRandomHexColor() {
  // Generate a random integer between 0 and 16777215 (hex FFFFFF).
  const randomInt = Math.floor(Math.random() * 16777215);
  // Convert the integer to a hex string and pad with zeros if necessary.
  const hexColor = randomInt.toString(16).padStart(6, "0");
  return `${hexColor}`;
}

// const maleProfileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}&top=dreads01,dreads02,frizzle,shaggyMullet,shaggy,shortCurly,shortFlat,shortWaved&eyes=default&facialHair=beardLight,beardMajestic&eyebrows=default&mouth=default&facialHairColor=${utilsFunctions.getRandomHexColor()}&hairColor=${utilsFunctions.getRandomHexColor()}`;
// const womanProfileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}&top=bigHair,bob,bun,curly,curvy,dreads,straight01&eyes=default&facialHair=beardLight,beardMajestic&eyebrows=default&mouth=default&facialHairColor=${utilsFunctions.getRandomHexColor()}&hairColor=${utilsFunctions.getRandomHexColor()}&facialHairProbability=0`;
