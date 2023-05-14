import { useEffect, useRef, useState } from "react";

import * as JsSearch from "js-search";
import { useRouter } from "next/router";
var svgNotFound = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="ai ai-Cross"
    >
      <path d="M20 20L4 4m16 0L4 20" />
    </svg>
  );
export default function Home() {
    const router = useRouter();
  const searchTermRef = useRef();
  var [getBooks, setBooks] = useState([]);
  var [storage, setStorage] = useState([]);
  var [backButton, setBackButton] = useState(null);
  function showResults() {
    setBackButton(null)
    searchTermRef.current.value = "";
    fetch(
        `https://bookdb.tallphin.repl.co/data.json`
      )
        .then((response) => response.json())
        .then((data) => {
          var tempDataObj = [];
          var items = data.data.reverse();
          setStorage(items);
          tempDataObj.push(<h3>Found {items.length} results!</h3>)
          items.forEach((item, i) => {
            console.log(`INDEX: ${i} of ${items.length}`);
            var thumb =
              item.thumbnail == "" ? svgNotFound : <img src={item.thumbnail} />;
            tempDataObj.push(
                <div key={i}>
                <div className="card">
                  {thumb}
                  <h2>{item.title}</h2>
                  <div className="infoGrid">
                    <p>Authors: {item.authors}</p>
                    <p>
                      Retail price: {item.retailPrice} {item.currencyCode}
                    </p>
                  </div>
                  <p align="left">{item.description}</p>
                </div>
                <br />
              </div>
            );
          });
          setBooks(tempDataObj);
        });
  }
  useEffect(() => {
    showResults();
    }, []);
      function searchBooks() {
        setBackButton(<button onClick={showResults}>Back</button>)
        var tempDataObj = [];
        var searchBar = searchTermRef.current.value;
        var searchdb = new JsSearch.Search("id");
        searchdb.addIndex("title");
        searchdb.addIndex("description");
        searchdb.addIndex("authors");
        searchdb.addDocuments(storage);
        var results = searchdb.search(searchBar);
        results.forEach((item, i) => {
            var thumb = item.thumbnail == "" ? svgNotFound : <img src={item.thumbnail} />;
            tempDataObj.push(
                <div key={i}>
              <div className="card">
                {thumb}
                <h2>{item.title}</h2>
                <div className="infoGrid">
                  <p>Authors: {item.authors}</p>
                  <p>
                    Retail price: {item.retailPrice} {item.currencyCode}
                  </p>
                </div>
                <p align="left">{item.description}</p>
              </div>
              <br />
            </div>
            )

        })
        setBooks(tempDataObj);
      }
  return (
    <>
      <div className="cont">
        <h1>Books in your library</h1><br /><button style={{margin: 'auto', marginTop: '-20px'}}onClick={()=>{router.push('/addbooks')}}>Add books to library</button><br/><br/><br/><br/>
        
      <input type="text" placeholder="Enter book name" ref={searchTermRef} />
        <br />{backButton}&nbsp;&nbsp;<button onClick={searchBooks}>Search</button> 
        <br />
        <br />
        <div style={{ padding: "0% 5%" }} /*ref={content}*/>{getBooks}</div><br/><br/>
      </div>
    </>
  );
}
