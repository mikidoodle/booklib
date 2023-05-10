import home from "../public/home.jpg";
import { useRef, useState } from "react";
var svgNotFound = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ai ai-Cross"><path d="M20 20L4 4m16 0L4 20"/></svg>
export default function Home() {
  const searchTermRef = useRef();
  const content = useRef();
  var [getBooks, setBooks] = useState([]);
  function addBook(obj) {

  }
  function loadBooks() {
    var bookName = searchTermRef.current.value;
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        bookName
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        var tempDataObj = []
        var items = data.items;
        items.forEach((item, i) => {
          console.log(`INDEX: ${i} of ${items.length}`);
          var vi = item.volumeInfo;
          var thumb = vi.imageLinks.thumbnail || ""
          var lp = item.saleInfo.listPrice || {
            amount: "N/A",
            currencyCode: "",
          };
          var desc = vi.description || ""
          var obj = JSON.stringify({
            title: vi.title,
            authors: vi.authors,
            retailPrice: lp.amount,
            currencyCode: lp.currencyCode,
            description: desc,
            thumbnail: thumb,
          });
          tempDataObj.push(
              <>
                <div className="card">
                  <img src={thumb} />
                  <h2>{vi.title}</h2>
                  <p align="left">Authors: {vi.authors}</p>
                  <p align="left">
                    Retail price: {lp.amount} {lp.currencyCode}
                  </p>
                  <p align="left">Description: {desc}</p>
                  <button onclick="addBook(hi)">Add to list</button>
                </div>
                <br />
              </>
            )
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
        <h1>Add book to list</h1>
        <input type="text" placeholder="Enter book name" ref={searchTermRef} />
        &nbsp;&nbsp;<button onClick={loadBooks}>Search</button>
        <br />
        <br />
        <div style={{ padding: "0% 5%" }} /*ref={content}*/>
          {getBooks}
        </div>
      </div>
    </>
  );
}
