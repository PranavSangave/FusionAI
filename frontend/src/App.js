import React, { useState } from 'react';
import './App.css'; // Import your CSS file for styling
import image from './image.jpg'; // Import your image file
import ReactPlayer from 'react-player'; // Import the react-player component



const App = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [filename, setFilename] = useState('');
  const [answer, setAnswer] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleSubmitQueryModel = async () => {
    setLoading(true); // Set loading to true while waiting for response
    
    // Fetch the question and context from the form fields
    const questionInput = document.getElementById('question');
    const contextInput = document.getElementById('context');

    // Get the values of question and context
    const questionValue = questionInput.value;
    const contextValue = contextInput.value;

    try {
      // Make POST request to the API endpoint
      const response = await fetch('http://localhost:8000/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: questionValue,
          context: contextValue
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      // Get the JSON response
      const responseData = await response.json();

      // Set the response as the answer
      setAnswer("Answer: " + responseData.answer);
    } catch (error) {
      console.error('Error:', error);
      // Handle error if needed
    } finally {
      setLoading(false); // Set loading to false after response received
    }
  };

  const handleSubmitQueryCaptioningLarge = async () => {
    setLoading(true);
    // Fetch the question and context from the form fields
    const filePath = document.getElementById('filename');

    // Get the values of question and context
    const filepathName = filePath.value;

    try {
      // Make POST request to the API endpoint
      const response = await fetch('http://localhost:8000/captioning/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: filepathName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      // Get the JSON response
      const responseData = await response.json();

      // Set the response as the answer
      setAnswer("Answer: " + responseData[0].generated_text);
    } catch (error) {
      console.error('Error:', error);
      // Handle error if needed
    } finally {
      setLoading(false); // Set loading to false after response received
    }
  };

  const handleSubmitQueryObjectDetection = async () => {
    setLoading(true);
    // Write your code to call query_object_detection API with filename
    // Fetch the question and context from the form fields
    const filePath = document.getElementById('filename');

    // Get the values of question and context
    const filepathName = filePath.value;

    try {
      // Make POST request to the API endpoint
      const response = await fetch('http://localhost:8000/object_detection/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: filepathName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      // Get the JSON response
      const responseData = await response.json();
      const labels = responseData.map(obj => obj.label);

      // Set the response as the answer
      if (labels.length === 0)
        setAnswer("Sorry! Unable to Detect!");
      else
        setAnswer("Objects Detected: " + labels);
    } catch (error) {
      console.error('Error:', error);
      // Handle error if needed
    }finally {
      setLoading(false); // Set loading to false after response received
    }
  };

  const handleSubmitRunReplicate = async () => {
    setLoading(true);
    // Fetch the question and context from the form fields
    const filePath = document.getElementById('caption');

    // Get the values of question and context
    const filepathName = filePath.value;

    const rawData = {
      "alpha": 0.5,
      "prompt_a": filepathName,
      "denoising": 0.75,
      "seed_image_id": "vibes",
      "num_inference_steps": 50
    }


    try {
      // Make POST request to the API endpoint
      const response = await fetch('http://localhost:8000/replicate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_data: rawData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      // Get the JSON response
      const responseData = await response.json();

      setMusicUrl(responseData.audio);
      setAnswer("Music URL: " + responseData.audio);

    } catch (error) {
      console.error('Error:', error);
      // Handle error if needed
    } finally {
      setLoading(false); // Set loading to false after response received
    }
  };

  const handleSubmitVideoGeneration = async () => {
    setLoading(true);
    // Fetch the question and context from the form fields
    const filePath = document.getElementById('vdo_caption');

    // Get the values of question and context
    const filepathName = filePath.value;

    const rawData = {
      "fps": 24,
      "model": "xl",
      "width": 1024,
      "height": 576,
      "prompt": filepathName,
      "batch_size": 1,
      "num_frames": 24,
      "init_weight": 0.5,
      "guidance_scale": 17.5,
      "negative_prompt": "very blue, dust, noisy, washed out, ugly, distorted, broken",
      "remove_watermark": false,
      "num_inference_steps": 50
    }


    try {
      // Make POST request to the API endpoint
      const response = await fetch('http://localhost:8000/video_gen/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_data: rawData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      // Get the JSON response
      const responseData = await response.json();

      setMediaUrl(responseData[0]);
      setAnswer("Video URL: " + responseData[0]);

    } catch (error) {
      console.error('Error:', error);
      // Handle error if needed
    } finally {
      setLoading(false); // Set loading to false after response received
    }
  };

  const renderForm = () => {
    switch (activeCard) {
      case 'Question Answering AI':
        return (
          <div className="form">
            <input
              type="text"
              id="question"
              placeholder="Enter Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <input
              type="text"
              id="context"
              placeholder="Enter Context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <button onClick={handleSubmitQueryModel}>Submit</button>
            {loading ? <p>Loading...</p> : answer && <p className="answer">{answer}</p>}
          </div>
        );
      case 'Image Captioning AI':
        return (
          <div className="form">
            <input
              type="text"
              id="filename"
              placeholder="Enter Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <button onClick={handleSubmitQueryCaptioningLarge}>Submit</button>
            {loading ? <p>Loading...</p> : answer && <p className="answer">{answer}</p>}
          </div>
        );
      case 'Object Detection AI':
        return (
          <div className="form">
            <input
              type="text"
              id="filename"
              placeholder="Enter Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <button onClick={handleSubmitQueryObjectDetection}>Submit</button>
            {loading ? <p>Loading...</p> : answer && <p className="answer">{answer}</p>}
          </div>
        );
      case 'Music Generation AI':
        return (
          <div className="form">
            <input
              type="text"
              id="caption"
              placeholder="Enter Music Caption"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <button onClick={handleSubmitRunReplicate}>Submit</button>
            {musicUrl && (
              <div>
                {/* Render the audio player component with the music URL */}
                <ReactPlayer url={musicUrl} controls={true} />
              </div>
            )}
            {loading ? <p>Loading...</p> : answer && <p className="answer">{answer}</p>}
          </div>
        );
      case 'Video Generation AI':
        return (
          <div className="form">
            <input
              type="text"
              id="vdo_caption"
              placeholder="Enter Video Caption"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <button onClick={handleSubmitVideoGeneration}>Submit</button>
            {mediaUrl && (
              <div>
                {/* Render the video player component with the video URL */}
                <ReactPlayer url={mediaUrl} controls={true} width="100%" height="100%" />
              </div>
            )}
            {loading ? <p>Loading...</p> : answer && <p className="answer">{answer}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src={image} alt="Placeholder" className="image" />
      </div>
      <div className="list-container">
        {activeCard ? (
          <div className="card">
            <h2>{activeCard}</h2>
            {renderForm()}
            <button onClick={() => setActiveCard(null)}>Back</button>
          </div>
        ) : (
          <>
            <div className="card" onClick={() => setActiveCard('Question Answering AI')}>
              <h2>Question Answering AI</h2>
            </div>
            <div className="card" onClick={() => setActiveCard('Image Captioning AI')}>
              <h2>Image Captioning AI</h2>
            </div>
            <div className="card" onClick={() => setActiveCard('Object Detection AI')}>
              <h2>Object Detection AI</h2>
            </div>
            <div className="card" onClick={() => setActiveCard('Music Generation AI')}>
              <h2>Music Generation AI</h2>
            </div>
            <div className="card" onClick={() => setActiveCard('Video Generation AI')}>
              <h2>Video Generation AI</h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
