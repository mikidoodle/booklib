import { useRef, useState } from "react";
import { useRouter } from "next/router";
var svgNotFound = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ai ai-Cross"
  >
    <path d="M20 20L4 4m16 0L4 20" />
  </svg>
);
export default function AddBook() {
  const router = useRouter();
  const searchTermRef = useRef();
  const content = useRef();
  var [getBooks, setBooks] = useState([]);
  var [dictionary, setDictionary] = useState([]);
  function addBook(obj) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams(obj)
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    fetch("https://bookdb.tallphin.repl.co/addBook", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.status== 200) {
          window.location.reload()
        } else {
          alert("Error adding book to list")
        }
      })
      .catch((error) => console.log("error", error));
  }

  function loadBooks() {
    fetch("https://bookdb.tallphin.repl.co/data.json", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        var tempDict = [];
        console.log(result)
        result.data.forEach((item, i) => {
          tempDict.push(item.id)
        })
        setDictionary(tempDict)
        console.log(dictionary)
        })
    var bookName = searchTermRef.current.value;
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        bookName
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        var tempDataObj = [];
        var items = data.items;
        items.forEach((item, i) => {
          console.log(`INDEX: ${i} of ${items.length}`);
          var vi = item.volumeInfo;
          var thumb = vi.imageLinks || { thumbnail: "" };
          var lp = item.saleInfo.listPrice || {
            amount: "N/A",
            currencyCode: "",
          };
          var desc = vi.description || "";
          var obj = {
            id: item.id,
            title: vi.title,
            authors: vi.authors,
            retailPrice: lp.amount,
            currencyCode: lp.currencyCode,
            description: desc,
            thumbnail: thumb.thumbnail,
          };
          thumb =
            thumb.thumbnail == "" ? svgNotFound : <img src={thumb.thumbnail} />;
          tempDataObj.push(
            <div key={i}>
              <div className="card">
                {thumb}
                <h2>{vi.title}</h2>
                <div className="infoGrid">
                  <p>Authors: {vi.authors}</p>
                  <p>
                    Retail price: {lp.amount} {lp.currencyCode}
                  </p>
                </div>
                <p align="left">Description: {desc}</p>
                {dictionary.includes(item.id) ? <b>Already in list</b> : <button
                  onClick={() => {
                    addBook(obj);
                  }}
                >
                  Add to list
                </button>}<br /><br/>
                ID: <i>{item.id}</i>
              </div>
              <br />
            </div>
          );
          /*content.current.innerHTML += `
            <div
              class="card"
            >
            <img src="${vi.imageLinks.thumbnail}" />
              <h2>${vi.title}</h2>
              <p align="left">Authors: ${vi.authors}</p>
              <p align="left">Retail price: ${lp.amount} ${lp.currencyCode}</p>
              <p align="left">Description: ${si.textSnippet}</p>
              <button onclick="addBook(hi)">Add to list</button>
            </div>
            <br />`;*/
        });
        setBooks(tempDataObj);
      });
  }
  return (
    <>
      <div className="cont">
        <button onClick={()=>{router.push('/')}}>Back</button>
        <h1>Add book to list</h1>
        <input type="text" placeholder="Enter book name" ref={searchTermRef} />
        &nbsp;&nbsp;<button onClick={loadBooks}>Search</button>
        <br />
        <br />
        <div style={{ padding: "0% 5%" }} /*ref={content}*/>{getBooks}</div>
      </div>
    </>
  );
}
