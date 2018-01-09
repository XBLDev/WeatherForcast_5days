import React from 'react';
import moment from 'moment';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            UsrLat: '',
            UsrLon: '',
            UsrCity: '',
            CurrentDisplayingDay: 0,
            GettingData: false,
            DataLoaded: false,            
            WeatherDetails: []
        };
    }

    onDayClicked(value) {
        this.setState({ CurrentDisplayingDay: value });
    }

    componentWillMount() {
        /**
         * Get user's Lat and Lon for the openweathermap api call, 
         * The openweathermap api doens't seem to have a function to 
         * detect user's location
         */
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://ip-api.com/json", true);
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                var Response = JSON.parse(xhr.responseText);
                this.setState({
                    UsrLat: Response.lat,
                    UsrLon: Response.lon,
                    GettingData: true,
                    DataLoaded: false
                });
            }
        });
        xhr.send();
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.GettingData === true) {
            var RequestUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=".concat(this.state.UsrLat).concat("&lon=")
                .concat(this.state.UsrLon).concat("&units=metric&cnt=5&mode=json&APPID=secretkey");
            const xhr = new XMLHttpRequest();
            xhr.open("GET", RequestUrl, true);
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    var Response = JSON.parse(xhr.responseText);
                    var Details = [];
                    var WeatherCellElements = [];
                    for (var i = 0; i < Response.list.length; i++) {
                        Details.push({});
                        Details[Details.length - 1].Date = moment().add(i, 'days').format('DD/MM/YY');
                        Details[Details.length - 1].Clouds = Response.list[i].clouds;
                        Details[Details.length - 1].Humidity = Response.list[i].humidity;
                        Details[Details.length - 1].WindSpeed = Response.list[i].speed;
                        Details[Details.length - 1].Temp = Response.list[i].temp.day;
                        Details[Details.length - 1].TempMax = Response.list[i].temp.max;
                        Details[Details.length - 1].TempMin = Response.list[i].temp.min;
                        Details[Details.length - 1].WeatherDescription = Response.list[i].weather[0].description;
                        Details[Details.length - 1].WeatherIcon = "http://openweathermap.org/img/w/".concat(Response.list[i].weather[0].icon).concat(".png");
                    }
                }

                this.setState({
                    UsrCity: Response.city.name,
                    WeatherDetails: Details,
                    GettingData: false,
                    DataLoaded: true
                });
            });
            xhr.send();
        }
    }

    render() {

        var DayCells = [];
        for (var i = 0; i < this.state.WeatherDetails.length; i++) {
            DayCells.push(
                <div key={i} className="daycell" onClick={this.onDayClicked.bind(this, i)}>
                    <div className={this.state.CurrentDisplayingDay == i ? "bg-primary" : "bg-info"}>
                        {this.state.WeatherDetails[i].Date.substring(0, this.state.WeatherDetails[i].Date.lastIndexOf('/'))}<br />
                        <img src={this.state.WeatherDetails[i].WeatherIcon} /><br />
                        {this.state.WeatherDetails[i].TempMax.toFixed(0)}&#176; {this.state.WeatherDetails[i].TempMin.toFixed(0)}&#176;
                    </div>
                </div>
            );
        }

        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">WeatherForcast</a>
                        </div>
                        <div id="navbar" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#">Home</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container" id="centerarea">
                    <div className="row" >
                        <div className="col col-lg-6 col-md-10 col-sm-12 col-xs-12 col-lg-offset-3 col-md-offset-1" id="firstrow">
                            <div className="weather">
                                <div className="current">
                                    {this.state.DataLoaded ? (
                                        <div className="info">
                                            <div className="bg-primary">
                                                <div>&nbsp;</div>
                                                <div className="city">{String(this.state.UsrCity).toUpperCase()}</div>
                                                <div className="citytime">
                                                    {String(this.state.WeatherDetails[this.state.CurrentDisplayingDay].Date).toUpperCase()}
                                                </div>
                                                <div className="weatherdescription">
                                                    {String(this.state.WeatherDetails[this.state.CurrentDisplayingDay].WeatherDescription).toUpperCase()}
                                                </div>
                                                <div className="temp">
                                                    <img src={this.state.WeatherDetails[this.state.CurrentDisplayingDay].WeatherIcon} className="tempicon" />
                                                    {this.state.WeatherDetails[this.state.CurrentDisplayingDay].Temp.toFixed(1)}
                                                    <small><small><small><small><small><small><small><small>&#8451;</small></small></small></small></small></small></small></small>                                                    
                                                </div>
                                                <div>&nbsp;</div>
                                            </div>
                                        </div>) :
                                        (
                                            <div>LOADING...</div>
                                        )
                                    }

                                    {this.state.DataLoaded ? (
                                        <div className="icon">
                                            <div>&nbsp;</div>
                                            <div>HUMIDITY: {String(this.state.WeatherDetails[this.state.CurrentDisplayingDay].Humidity).toUpperCase()}%</div>
                                            <div>WIND: {String(this.state.WeatherDetails[this.state.CurrentDisplayingDay].WindSpeed).toUpperCase()} m/s</div>
                                            <div>CLOUDINESS: {String(this.state.WeatherDetails[this.state.CurrentDisplayingDay].Clouds).toUpperCase()}%</div>
                                            <div>&nbsp;</div>
                                        </div>) :
                                        (
                                            <div></div>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                        <div
                            className="col col-lg-6 col-md-10 col-sm-12 col-xs-12 col-lg-offset-3 col-md-offset-1" id="secondrow">
                            <div className="weatheralldays">
                                <div className="alldays">
                                    {DayCells}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App