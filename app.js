import pLimit from "p-limit";
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

    for (let data of responses) {
      numOfele += data.data.num.length;
      for (let it of data.data.num) {
        sum += it;
      }
    }
    avg = sum / numOfele;

    return avg;
  } catch (err) {
    console.log("=======+>", err);
  }
}
fun(endpoints, 2).then((avg) => console.log(avg));
