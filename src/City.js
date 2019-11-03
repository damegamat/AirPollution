import React from "react";
import fetchJsonp from "fetch-jsonp";

class City extends React.Component {
  state = { descriptionID: "", descriptionText: "" };

  getDescription = () => {
    console.log(this.props.name);
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
          console.log(data.query.pages[this.state.descriptionID].description);
          this.setState({
            descriptionText:
              data.query.pages[this.state.descriptionID].description
          });
          console.log(data.query.pages[this.state.descriptionID].description);
        });
    }
  };
  componentDidMount() {
    this.getDescription();
  }
  render() {
    return (
      <ul>
        <li>{this.props.name}</li>
        <p>{this.state.descriptionText}</p>
      </ul>
    );
  }
}

export default City;
