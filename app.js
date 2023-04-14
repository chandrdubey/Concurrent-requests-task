import pLimit from "./rateLimit.js";
import axios from "axios";
import https from "https";

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});
const endpoints = [
  "https://jsonkeeper.com/b/8N8Y",
  "https://jsonkeeper.com/b/XR1U",
  "https://jsonkeeper.com/b/JJPT",
  "https://jsonkeeper.com/b/94IC",
  "https://jsonkeeper.com/b/WNNS",
];

const sampleData = {
  num: [34, 3, 64, 78],
};
// const limit = pLimit(3);

// const requests = endpoints.map((account) => limit(() => axios.get(account)));
function allSum(arr, data) {
  // console.log("🚀 ~ file: app.js:25 ~ allSum ~ data:", data, arr);
  let currSum = data.data.num.reduce(findSum, arr[0]);
  let currlen = data.data.num.length + arr[1];

  // let sum = arr[0] + currSum;
  return [currSum, currlen];
}
function findSum(sum, data) {
  sum += data;
  return sum;
}
async function fun(endPoints, numOfConcurency) {
  try {
    const limit = pLimit(numOfConcurency);
    const requests = endPoints.map((account) =>
      limit(() => instance.get(account))
    );
    const responses = await Promise.all(requests);

    let avg = 0;
    let sum = 0;
    let numOfele = 0;
    const result = responses.reduce(allSum, [0, 0]);
    // for (let data of responses) {
    //   numOfele += data.data.num.length;
    //   for (let it of data.data.num) {
    //     sum += it;
    //   }
    // }
    avg = result[0] / result[1];

    return avg;
  } catch (err) {
    console.log("=======+>", err);
  }
}
fun(endpoints, 2).then((avg) => console.log(avg));
