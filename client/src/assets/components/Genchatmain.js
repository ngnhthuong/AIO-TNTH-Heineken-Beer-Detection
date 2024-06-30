import React, { useState, useRef, useEffect } from "react";
import sentImg from "../images/sent_new.png";
import paperclip from "../images/paperclip_new.png";
import Iconlogo from "../images/icon-logo.png";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useTable } from 'react-table';
import Loading from "../images/loading.gif";
export default function Genchatmain() {
  const [message, setMessage] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const fileInputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [resultMessage, setResultMessage] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setInputValue("Name of chat");
  }, []);

  useEffect(() => {
    return () => {
      fileObjects.forEach(fileObj => URL.revokeObjectURL(fileObj.url));
    };
  }, [fileObjects]);

  const handleSend = async () => {
    setLoading(true);
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
          },
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadUrl(url);

        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setFileContent(json);

          const botResponse = {
            "role": "AIO_TNTH",
            "message": "Here's your processed file.",
            "fileContent": json
          };
          setResultMessage(prevMessages => [...prevMessages, botResponse]);
        };
        reader.readAsArrayBuffer(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
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

  const Table = ({ columns, data }) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({ columns, data });

    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
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
              <div className="name">Bots</div>
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
                  <div className="name">Bots</div>
                </div>
                <div className="genchat__context">{msg.message}</div>
                <div className="genchat__context">
                  {downloadUrl && (
                    <a href={downloadUrl} download="output.xlsx">
                      <button className="botton__download">Download Excel</button>
                    </a>
                  )}</div>
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
                <div className="genchat__context genchat_images">
                  {msg.files.map((file, index) => (
                    <img className="genchat_images--image" key={index} src={file.url} alt={`Selected ${index}`} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div
          className="genchat__main--inputext"
          style={loading ? { minHeight: '20%' } : { minHeight: fileObjects.length > 0 ? '30%' : '20%' }}
        >
          {fileObjects.length > 0 && (
            <>
              <div className="genchat__main--displayimg" style={{ display: loading ? 'none' : '' }}>
                {fileObjects.map((fileObj, index) => (
                  <div key={fileObj.id} className="image-container">
                    <img src={fileObj.url} alt={`Selected ${index}`} />
                    <button onClick={() => handleDeleteImage(fileObj.id)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                <hr />
              </div>
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
            {loading ? (<button className="button__send">
              <img src={Loading} alt="Send message" />
            </button>) : (<button className="button__send" onClick={handleSend}>
              <img src={sentImg} alt="Send message" />
            </button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
