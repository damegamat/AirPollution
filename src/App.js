import React from "react";
import City from "./City";
import "./Styles/App.css";

//API KEY
//Country
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

  autoComplete = prevState => {
    const value = this.refs.text.value;
    const valueToLower = value.toLowerCase();
    let suggestions = [];
    if (value.length > 0) {
      suggestions = this.country.filter(item =>
        item.toLowerCase().includes(valueToLower)
      );
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
            this.setState(() => ({
              code: item.code,
              pass: true
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
    console.log("ok");
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
        });
        const tenCities = [...new Set(cities)];
        tenCities.splice(10);
        this.setState({
          cities: tenCities
        });
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.text !== prevState.text) {
      this.getCountry();
    }

    if (this.state.code.length > 0 && this.state.pass) {
      console.log("mozesz isc");
      if (prevState.code !== this.state.code) {
        console.log("rozne");
        this.getCities();
      }
    }
  }
  render() {
    const { suggestions, text, cities, descriptionText } = this.state;
    return (
      <>
        <div className="App">
          <input
            value={text}
            type="text"
            onChange={this.autoComplete}
            ref="text"
          ></input>
          <ul>
            {suggestions.map(item => (
              <li onClick={() => this.suggestionsSelected(item)} key={item}>
                {item}
              </li>
            ))}
          </ul>
          <ul>
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
      </>
    );
  }
}

export default App;
