import React from "react";
import fetchJsonp from "fetch-jsonp";

import "../Styles/css/City.css";

class City extends React.Component {
  state = {
    descriptionID: "",
    descriptionText: "",
    descriptionIsActive: false
  };

  getDescription = () => {
    //API DESCRIPTION
    const APIdescription = `https://en.wikipedia.org/w/api.php?action=query&titles=${this.props.name}&format=json&prop=description`;
    if (this.props.name.length > 0) {
      fetchJsonp(APIdescription)
        .then(res => {
          if (res.ok) {
            return res;
          }
          throw Error(alert("Something goes wrong "));
        })
        .then(res => res.json())
        .then(data => {
          this.setState({
            descriptionID: Object.keys(data.query.pages)[0]
          });
          return data;
        })
        .then(data => {
          this.setState({
            descriptionText:
              data.query.pages[this.state.descriptionID].description
          });
        });
    }
  };

  hadleAddActive = () => {
    this.setState({
      descriptionIsActive: !this.state.descriptionIsActive
    });
  };

  componentDidMount() {
    this.getDescription();
  }
  render() {
    return (
      <>
        <li className={" City__item"} onClick={this.hadleAddActive}>
          {this.props.name}
        </li>
        <p
          className={`City__description 
            ${
              this.state.descriptionIsActive ? "City__description--active" : ""
            }`}
        >
          {this.state.descriptionText ? this.state.descriptionText : "No Data"}
        </p>
      </>
    );
  }
}

export default City;
