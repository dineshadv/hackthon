const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyBWNbDQhBazXoNXqrnyXE7K8_TbVs1NUBw");
let onewordData = ''
let getoutfitdetails = ''
async function run(weatherdata) {
    console.log("weatherdata",weatherdata)
  // For text-only input, use the gemini-pro model
  try{

  
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = weatherdata

  const result = await model.generateContent(prompt);
  const response = await result.response;
  onewordData = response.text();
//   console.log(text);
//   return text
}
catch(err){
    console.log(err)
}

}

async function getcompleteoutfitdata(onewordDatad) {
    // console.log("weatherdata",weatherdata)
  // For text-only input, use the gemini-pro model
  try{

  
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = `give me the exact name of the outfit like tshirt or troushers like for day ${onewordDatad} day`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  getoutfitdetails = response.text();
  
//   console.log(text);
  return getoutfitdetails
}
catch(err){
    console.log(err)
}

}
 
module.exports = getcompleteoutfitdata;