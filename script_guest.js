// Get the microphone button element
const microphoneButton = document.getElementById('microphoneButton');
const utterance = document.getElementById('userUtterance');
const userInput = document.getElementById('userInput');

// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  // Create an instance of the SpeechRecognition object
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  // Set the recognition language
  recognition.lang = 'en-US'; // Specify the desired language

  // Add a click event listener to the button
  microphoneButton.addEventListener('click', () => {
    // Start speech recognition when the user speaks
    recognition.start();
    microphoneButton.classList.toggle('clicked');
  });

  // Define the event handler for when speech is recognized
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('Transcript:', transcript);
    utterance.innerHTML = transcript;
    userInput.value =
      transcript +
      '\n' +
      "Answer the above question by imagining you are Alea, a chatbot for AirBnB which helps guests and hosts. The user's name is Joy and he is a guest. Reply precisely. Use these info if you don't know the answer: Wifi password - ALEA_123, airbnb location - 300 South Craig street, Pittsburgh 15217.  Otherwise make up hypothetical precise details.";
    // Here, you can perform any desired actions with the transcribed text
    // For example, you can update a text field or send the transcript to a server
    event.preventDefault();

    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:predict`;
    console.log('API Endpoint: ', url);

    const body = {
      instances: [{ content: userInput.value }],
      parameters: {
        temperature: 0.1,
        maxOutputTokens: 256,
        topP: 0.46,
        topK: 16,
      },
    };

    console.log('Request Body: ', body);

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log('API Response: ', response);
        return response.json();
      })
      .then((data) => {
        console.log('API Data: ', data);
        if (data.predictions && data.predictions.length > 0 && data.predictions[0].content) {
          outputPara.textContent = `Output: ${data.predictions[0].content}`;
        } else {
          console.log('Invalid or empty predictions in API data: ', data);
          outputPara.textContent = `No output received from API`;
        }
      })
      .catch((error) => {
        console.log('API Error: ', error);
        outputPara.textContent = `Error: ${error}`;
      });
  };
} else {
  console.log('Speech recognition not supported in this browser.');
}
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';
const PROJECT_ID = 'grand-kingdom-392214';
const MODEL_ID = 'text-bison@001';
let AUTH_TOKEN =
  'ya29.a0AbVbY6NtXk8WHFpSesHhzCDONOzdP7-fLvRrbgi4ysoRwCm1w0GRItK4wrE_QecrOxNgT5DKa18bvVRVplqGa-3O40k9taOPiSozxmJcWg1UdzTMD_8C60jcuMXtz-guhbA1K-7oZUO5MLTFumS54JyfBYLZNzzyHliegh_CSjfvWmk5WaZsh4aJHV91SixAekqjvX-GswsRsRWUL2ny0prbklchAUSKN6IVb-7u2QQnc27FmOXME72Lj3opWgZCqqf8PaFIvMlIHGbKF-IB007kVglEbxZP9MOdSoRex27VtCki8C0QEOonRXijOo081WH0KWAQ32fXAu1GjsuPUr0QOnbT-9y5hf_Ura10HLYOLWO3oHTgfPYQHmveOA0k_Ue-u98M7cUbDl4IzsBP3SLQoQAaCgYKAQkSARMSFQFWKvPlKmUSNFI7Sd_ynEzCrviX9w0418';
const form = document.getElementById('apiForm');
const outputPara = document.getElementById('output');
// AUTH_TOKEN = AUTH_TOKEN.replace('awdOFE6wFg', '');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const userInput = document.getElementById('userInput').value;
  let contexeduserInput =
    userInput +
    '\n' +
    "Answer the above question by imagining you are Alea, a chatbot for AirBnB which helps guests and hosts. The user's name is Joy and he is a guest. Reply precisely. Use these info if you don't know the answer: Wifi password - ALEA_123, airbnb location - 300 South Craig street, Pittsburgh 15217. Otherwise make up hypothetical precise details.";
  console.log('User Input: ', contexeduserInput);

  const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:predict`;
  console.log('API Endpoint: ', url);

  const body = {
    instances: [{ content: contexeduserInput }],
    parameters: {
      temperature: 0.1,
      maxOutputTokens: 256,
      topP: 0.46,
      topK: 16,
    },
  };

  console.log('Request Body: ', body);

  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      console.log('API Response: ', response);
      return response.json();
    })
    .then((data) => {
      console.log('API Data: ', data);
      if (data.predictions && data.predictions.length > 0 && data.predictions[0].content) {
        outputPara.value = `Alea: ${data.predictions[0].content}`;
      } else {
        console.log('Invalid or empty predictions in API data: ', data);
        outputPara.value = `No output received from API`;
      }
    })
    .catch((error) => {
      console.log('API Error: ', error);
      outputPara.textContent = `Error: ${error}`;
    });
});
