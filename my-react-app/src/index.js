import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Car(props) {
  let image = props.info.image;
  let infoCar = (
    <li>
      <div className="container">
      <div className='image'>
        <img src={image} width="150" height="100" align="left" alt=''></img>
      </div>
      <div className="text">
        <p>{props.info.name}</p>
      </div >
      </div>
    </li >
  );
  return infoCar;
}

function Garage(props) {
  return (
    <>
      <ul>{props.list.map((car) => <Car info={car} />)}</ul>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('mydiv'));

sendRequest('');

function sendRequest(filterString) {
  const Http = new XMLHttpRequest();
  const url = `https://search.outdoorsy.com/rentals?filter[keywords]=${filterString}&address=atlanta`;
  Http.open("GET", url);
  Http.send();
  let jsonData = '';
  Http.onreadystatechange = (e) => {
    jsonData = Http.responseText;

    let arrayOfObjects = JSON.parse(jsonData).data;


    let arrayOfObjectsSpecifics = JSON.parse(jsonData).included;
    let listCars = [];
    for (let i = 0; i < arrayOfObjects.length; i++) {
      let nameCar = arrayOfObjects[i].attributes.name;
      for (let x = 0; x < arrayOfObjectsSpecifics.length; x++) {
        // comparing two id strings
        if (arrayOfObjects[i].relationships.primary_image.data.id == arrayOfObjectsSpecifics[x].id) {
          let urlCarImage = arrayOfObjectsSpecifics[x].attributes.url;
          listCars.push({ "key": arrayOfObjects[i].id, "name": nameCar, "image": urlCarImage });
          break
        };
      };
    };
    root.render(<Garage list={listCars} />);
  };

}

let searchBar = document.getElementById('query');
searchBar.addEventListener('input', filter);

function filter(e) {
  let inputValue = e.target.value;
  sendRequest(inputValue);
};