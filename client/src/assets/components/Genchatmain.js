import React, { useState, useRef, useEffect } from "react";
import sentImg from "../images/sent.png";
import paperclip from "../images/paperclip.png";
import Iconlogo from "../images/icon-logo.png";
import axios from 'axios';

export default function Genchatmain() {
  const [message, setMessage] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const fileInputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [resultMessage, setResultMessage] = useState([]);

  useEffect(() => {
    setInputValue("Name of chat");
  }, []);

  useEffect(() => {
    return () => {
      fileObjects.forEach(fileObj => URL.revokeObjectURL(fileObj.url));
    };
  }, [fileObjects]);

  const handleSend = async () => {
    if (fileObjects.length > 0 || message.trim() !== "") {
      const formData = new FormData();
      if (fileObjects.length > 0) {
        fileObjects.forEach((fileObj) => formData.append("files", fileObj.file));
      }
      formData.append("message", message);
      let question = {
        "role": "You",
        "message": message,
        "files": fileObjects
      };
      setResultMessage(prevMessages => [...prevMessages, question]);

      try {
        const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setResultMessage(prevMessages => [...prevMessages, response.data]);
      } catch (error) {
        console.error('There was an error uploading the file!', error);
      }

      setMessage("");
      setFileObjects([]);
    }
  };

  useEffect(() => {
    if (resultMessage.length === 0) return;
    console.log("result is", resultMessage[0].files);
  }, [resultMessage]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFileObjects = selectedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file)
    }));
    setFileObjects((prevFileObjects) => [...prevFileObjects, ...newFileObjects]);
    event.target.value = null;
  };

  const handleDeleteImage = (id) => {
    setFileObjects((prevFileObjects) => {
      const newFileObjects = prevFileObjects.filter((fileObj) => fileObj.id !== id);
      const fileObjToDelete = prevFileObjects.find((fileObj) => fileObj.id === id);
      URL.revokeObjectURL(fileObjToDelete.url);
      return newFileObjects;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="genchat__main">
      <div className="genchat__main--head">
        <div className="genchat__main--head--func">
          <button className="genchat__main--head--func--item">
            <i className="fas fa-paw"></i>
            <span>New Chat</span>
          </button>
        </div>
      </div>
      <div className="genchat__main--chat">
        <div className="genchat__main--displaytext">
          <div className="genchat__bots--message">
            <div className="genchat__avatars">
              <div className="genchat__avatar">
                <img src={Iconlogo} alt="Bot Avatar" />
              </div>
              <div className="name">AIO_TNTH</div>
            </div>
            <div className="genchat__context">Hello I am AIO_TNT bot</div>
          </div>
          {resultMessage.length > 0 && resultMessage.map((msg, index) => (
            msg.role === "AIO_TNTH" ? (
              <div className={`genchat__bots--message`} key={index}>
                <div className="genchat__avatars">
                  <div className="genchat__avatar">
                    <img src={Iconlogo} alt="Bot Avatar" />
                  </div>
                  <div className="name">AIO_TNTH</div>
                </div>
                <div className="genchat__context">{msg.message.tasks[0].output}</div>
               <div className="genchat__context">{msg.message.tasks[1].output}</div>
                <div className="genchat__context">{msg.message.tasks[2].output}</div>
                <div className="genchat__context">{msg.message.tasks[3].output}</div>

                </div>
            ) : (
              <div className={`genchat__bots--message`} key={index}>
                <div className="genchat__avatars">
                  <div className="genchat__avatar">
                    <img src={Iconlogo} alt="User Avatar" />
                  </div>
                  <div className="name">You</div>
                </div>
                <div className="genchat__context">{msg.message}</div>
                <div className="genchat__context">
                  {msg.files.map((file, index) => (
                        <img key={index} src={file.url} alt={`Selected ${index}`} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div
          className="genchat__main--inputext"
          style={{ minHeight: fileObjects.length > 0 ? "30%" : "20%" }}
        >
          {fileObjects.length > 0 && (
            <>
              <div className="genchat__main--displayimg">
                {fileObjects.map((fileObj, index) => (
                  <div key={fileObj.id} className="image-container">
                    <img src={fileObj.url} alt={`Selected ${index}`} />
                    <button onClick={() => handleDeleteImage(fileObj.id)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
              <hr />
            </>
          )}
          <textarea
            className="input__text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please enter your prompt..."
          />
          <div className="genchat__main--chatfun">
            <div className="input-wrapper" onClick={triggerFileInput}>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <img src={paperclip} alt="Attach files" />
            </div>
            <button className="button__send" onClick={handleSend}>
              <img src={sentImg} alt="Send message" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
