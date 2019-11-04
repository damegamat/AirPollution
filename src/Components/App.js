import React from "react";
import City from "./City";
import "../styles/css/App.css";

//API COUNTRY
const APIcountry = "https://api.openaq.org/v1/countries";
class App extends React.Component {
  country = ["Poland", "Germany", "Spain", "France"];
  state = {
    suggestions: [],
    text: "",
    code: "",
    cities: [],
    pass: false
  };
  setLastText() {
    this.setState({
      text: `${
        localStorage.getItem("text") ? localStorage.getItem("text") : ""
      }`
    });
  }
  autoComplete = prevState => {
    const value = this.refs.text.value;
    localStorage.setItem(`text`, value);
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, `i`);
      suggestions = this.country.sort().filter(v => regex.test(v));
    }
    this.setState({
      suggestions,
      text: value
    });
  };
  suggestionsSelected(value) {
    this.setState(() => ({
      text: value,
      suggestions: []
    }));
  }
  capitalize = str => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  getCountry = () => {
    fetch(APIcountry)
      .then(res => {
        if (res.ok) {
          return res;
        }
        throw Error(alert("Something goes wrong "));
      })
      .then(res => res.json())
      .then(data => {
        data.results.map(item => {
          if (item.name === this.capitalize(this.state.text)) {
            console.log(item.name);
            this.setState(() => ({
              code: item.code,
              pass: true
            }));
          } else {
            this.setState(() => ({
              pass: false
            }));
          }
          return null;
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  getCities = () => {
    //API CITIES
    const API = `https://api.openaq.org/v1/measurements?country=${this.state.code}&parameter=pm25&order_by[]=value&sort=desc`;
    fetch(API)
      .then(res => {
        if (res.ok) {
          return res;
        }
        throw Error(alert("Something goes wrong "));
      })
      .then(res => res.json())
      .then(data => {
        const cities = [];
        data.results.map(item => {
          cities.push(item.city);
          return null;
        });
        const tenCities = [...new Set(cities)];
        tenCities.splice(10);
        this.setState({
          cities: tenCities
        });
      });
  };
  componentDidMount() {
    this.setLastText();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.text !== prevState.text) {
      this.getCountry();
    }

    if (this.state.code.length > 0 && this.state.pass) {
      if (prevState.code !== this.state.code) {
        this.getCities();
      }
    }
  }
  render() {
    const { suggestions, text, cities, descriptionText } = this.state;
    return (
      <div className="App">
        <h1>{"10 most polluted cities in country".toUpperCase()}</h1>
        <div className="Search">
          <input
            className="Search__input"
            value={text}
            type="text"
            onChange={this.autoComplete}
            ref="text"
          ></input>
          {suggestions.length > 0 ? (
            <ul className="Search__suggestion-list">
              {suggestions.map(item => (
                <li
                  className="Search__suggestion-item"
                  onClick={() => this.suggestionsSelected(item)}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="City">
          <ul className="City__list-item">
            {cities.map(name => (
              <City
                key={name}
                name={name}
                getDescription={this.getDescription}
                text={descriptionText}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
