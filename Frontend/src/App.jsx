import { useState , useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor"
import prism from "prismjs";
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
    return 1+1;}`)

    const [review, setReview] = useState('')

  useEffect(() => {
    prism.highlightAll();
  },[])

  async function reviewCode() {
   try {
        const response = await axios.post('http://localhost:3000/ai/get-review', { code });
        
        if (response.data && typeof response.data.review === 'string') {
            setReview(response.data.review);
        } else if (typeof response.data === 'string') {

             setReview(response.data);
        } else {
             
             console.error("Response data is not a string and does not contain a 'review' property.", response.data);
             setReview("Error: The server returned an unexpected data format.");
        }

    } catch (error) {
        console.error("Error fetching code review:", error);
        setReview("An error occurred. Check the console for network errors.");
    }
}

  return (
    <>
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              backgroundColor: "#272722",
              border: "1px solid #272822",
              borderRadius: "5px",
              height: "100%",
              width: "100%"
            }}

            ></Editor>
        </div>
        <div 
        onClick={reviewCode}
        className="review-button">Review</div>
      </div>
      <div className="right"><Markdown 
      rehypePlugins={[rehypeHighlight]}>{
        review}</Markdown>
      </div>
    </main>
    </>
  )
}

export default App
