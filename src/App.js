import './index.css';
import { useState, useEffect } from 'react';

function App() {
  const [value,setValue]=useState(null)
  const [message,setMessage]=useState(null)
  const [previousChats,setPreviousChats]=useState([])
  const [currentTitle, setCurrentTitle]=useState(null)
  //otm start 1
  const otm = "Assume this is a prompt which when given to you makes you act as \“the conversational AI system\” mentioned in the paragraph below right from the first response you give to the prompt and after having successfully conducting the survey finish the survey by saying \: \“ Thank you for participating in the survey, your feedback will help improve dining experience at Knor\’s Delicious Delights\. If you have any question you\’d like to ask, feel free to ask\. \n \”Assignment\: Conversational Survey Interview Generation with LLMs\. Objective\: Design and implement \“a conversational AI system\” that leverages an LLM (preferably GPT-3.5-Turbo-1106) to dynamically generate survey questions based on user interaction and the evolving context of the conversation\. You can assume the objective of the survey is to conduct a survey collecting information from a user who is a customer of an imaginary restaurant named Knor\’s Delicious Delights\:Family Restaurant about their dining experience at the restaurant\.Expectations from LLM chat experience\: - Start with introduction\: Start with the introduction and purpose of the survey and invite the user to engage in a conversation - Conversational Question Generation\: As the user provides feedback (e\.g\., describing their recent dining experience), the LLM should generate follow-up questions that\: - Dig deeper\: Probe for specific details and insights based on the user\'s initial responses. - Adapt dynamically\: Use keywords and sentiment analysis to tailor questions to the specific context of the conversation. - Maintain a natural flow\: Ensure the generated questions sound human-like and continue the conversational thread seamlessly. - Unbiased open-ended questions\: There should be no leading to specific answers or biasing questions that can lead to biased answers from respondent"
  // otm over 1

  const createNewChat= ()=>{
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }
  const handleClick=(t)=>{
    setCurrentTitle(t);
    setMessage(null);
    setValue("");
  }

  const getMessages = async()=>{
    const options = {
      method:"POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type":"application/json"
      }
    }
    try{
      const response = await fetch('http://localhost:8000/completions', options)
      const data =  await response.json()
      // console.log(data)
      setMessage(data.choices[0].message)

    } catch(error){
      console.error(error)
    }
  }
  // console.log(value);
  // console.log(message);
  useEffect(()=>{
    console.log(currentTitle,value,message);
    if(!currentTitle&&value&&message){
      setCurrentTitle(value)
    }
    if(currentTitle&&value&&message){
      setPreviousChats(prevChats=>(
        [...prevChats,
        {
           title:currentTitle,
           role:"user",
           content:value
        },
        {
          title:currentTitle,
          role:message.role,
          content:message.content

        }]
      ))
    }
  }, [message,currentTitle])
 // one time message 2
 // runs one time=========
 const otf = async()=>{
  const options = {
    method:"POST",
    body: JSON.stringify({
      message: otm
    }),
    headers: {
      "Content-Type":"application/json"
    }
  }
  try{
    const response = await fetch('http://localhost:8000/completions', options)
    const data =  await response.json()
    // console.log(data)
    setMessage(data.choices[0].message)

  } catch(error){
    console.error(error)
  }
}
  useEffect(()=> {otf()} 
    ,[])
  //====================
  // one time message over 2

  const currentChat = previousChats.filter(previousChat=>previousChat.title===currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat=>previousChat.title)))
  return (
    <div className="app">
      <section className="side-bar">
       <button onClick={createNewChat}>+ New Chat</button>
       <ul className="history">
         {uniqueTitles?.map((uniqueTitle,index)=><li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
       </ul>
       <nav>
        <p>Made by Vikalp</p>
       </nav>
     </section> 
     <section className="main">
      <h1>VikalpGPT</h1>
      <ul className="feed">
        {currentChat?.map((chatMessage,index)=><li key ={index}>
          <p className='role'>{chatMessage.role}</p>
          <p>{chatMessage.content}</p>
        </li>)}



      </ul>
      <div className="bottom-section">
        <div className="input-container">
          <input type="text" value={value} onChange={(e)=>setValue(e.target.value)} />
          <div id="submit"  onClick={getMessages}>Send</div>
        </div>
        <p className="info"></p>
      </div>
     </section>
    </div>
  );
}

export default App;
