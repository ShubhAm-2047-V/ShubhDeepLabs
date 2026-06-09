import { generateReply, classifyIntent } from './gemini.js';

async function test() {
  console.log("Classifying intent...");
  const intent = await classifyIntent("i want a website of a plant deasese dectector", []);
  console.log("Intent:", intent);
  
  console.log("Generating reply...");
  const reply = await generateReply("i want a website of a plant deasese dectector", [], "", intent, "test-session");
  console.log("Reply object:");
  console.log(JSON.stringify(reply, null, 2));
}

test();
