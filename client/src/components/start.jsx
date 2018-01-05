import React from 'react'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      UsrLat : '',
      UsrLon : '',
      GettingData: false,
      WeatherDetails: [],
      WeatherSummaries: []
    };
  }

  componentWillMount()
  {
    /**
     * Get user's Lat and Lon for the openweathermap api call, 
     * The openweathermap api doens't seem to have a function to 
     * detect user's location
     */
    const xhr = new XMLHttpRequest(); 
    xhr.open("GET", "http://ip-api.com/json", true);
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          this.setState({
            UsrLat: response.lat,
            UsrLon: response.lon,   
            GettingData: true            
          });                      
      }
    });
    xhr.send();  
  }

  componentDidUpdate(prevProps, prevState)
  {

    if(this.state.GettingData === true)
    {
      var RequestUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=".concat(this.state.UsrLat).concat("&lon=")
      .concat(this.state.UsrLon).concat("&mode=json&APPID=secretKeyHere");
      const xhr = new XMLHttpRequest(); 
      xhr.open("GET", RequestUrl, true);
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {

            var Response = JSON.parse(xhr.responseText);
            var Summaries = [];
            var Details = [];
            var Dates = [];
            var AveTemp = [];
            var CurrentDayRecordNum = 0;

            for(var i=0 ; i < Response.list.length; i++)
            {              
                var dt_txt = Response.list[i].dt_txt;
                var date = dt_txt.substring(0, dt_txt.lastIndexOf(' '));
                
                if(Dates.indexOf(date) === -1)
                /**
                 * If we don't have any detail for a date, create new detail list for that date, 
                 * and add summaries for the previous date if at least one date's weather summary
                 * is generate, in this case the summary is just the average temprature for a date.
                 */                
                {
                  Dates.push(date);
                  if(AveTemp.length > 0)
                  {
                    AveTemp[AveTemp.length-1] /= CurrentDayRecordNum;
                    Summaries.push([]);
                    Summaries[Summaries.length-1].push(
                     <div key={dt_txt}>
                           <h2>{Dates[Dates.length-2]}</h2>
                           <p>Average Temperature: {AveTemp[AveTemp.length-1]}</p>
                     </div>                    
                    );
                  }
                  CurrentDayRecordNum = 1;
                  
                  AveTemp.push(Number(Response.list[i].main.temp));
                  Details.push([]);
                  Details[Details.length-1].push(
                  <div key={dt_txt}>
                  <h2>
                    {"Time" + ": " + dt_txt.substring(dt_txt.lastIndexOf(" ")+1, dt_txt.length)}
                  </h2>
                  </div>);
                  for (var key in Response.list[i].main) {
                  Details[Details.length-1].push
                  (<div key={dt_txt.concat(key + ": " + Response.list[i].main[key])}>
                    {key + ": " + Response.list[i].main[key]}
                    </div>);
                  }
                }
                else
                {
                /**
                 * If we have already details for a date, add records to the details for that date,
                 * and if the last record is reached, calculate the average temperature for the last
                 * date, and add a new summary for the last date
                 */        
                  AveTemp[Dates.indexOf(date)] += Number(Response.list[i].main.temp);
                  CurrentDayRecordNum += 1;
                  
                  Details[Dates.indexOf(date)].push(
                  <div key={dt_txt}>
                    <h2>
                      {"Time" + ": " + dt_txt.substring(dt_txt.lastIndexOf(" ")+1, dt_txt.length)}
                    </h2>
                  </div>);

                  for (var key in Response.list[i].main) {
                    Details[Dates.indexOf(date)].push(
                    <div key={dt_txt.concat(key + ": " + Response.list[i].main[key])}>
                      {key + ": " + Response.list[i].main[key]}
                    </div>
                    );
                  }
                  
                  if(i === Response.list.length - 1)
                  {
                    AveTemp[AveTemp.length-1] /= CurrentDayRecordNum;
                    Summaries.push([]);
                    Summaries[Summaries.length-1].push(
                     <div key={dt_txt}>
                           <h2>{Dates[Dates.length-1]}</h2>
                           <p>Average Temperature: {AveTemp[AveTemp.length-1]}</p>
                     </div>                    
                    );
                  }
                }
            }          
            
            this.setState({
              WeatherDetails: Details,
              WeatherSummaries: Summaries,
              GettingData : false
            });
            
        }
      });
      xhr.send();  
    }
  }

  render() {

        return (
          <div>
              <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                  <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">Weather Forcast: 5 days</a>
                  </div>
                  <div id="navbar" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                      <li className="active"><a href="#">Home</a></li>
                    </ul>
                  </div>
                </div>
              </nav>

              <div className="container">
                  <div className="row content" id="centerarea">
                      <div className="col-md-8 text-left" > 
                            <div className="container" id="firstweatherarea">
                              <div className="page-header">
                                <h1>{this.state.WeatherSummaries[0]}</h1>
                                {this.state.WeatherDetails[0]}
                              </div>     
                            </div>
                      </div>
                  
                      <div className="col-md-4 sidenav" id="rightsidemenu">
                          <div className="panel-group" id="accordion">
                              <div className="panel panel-default">
                                  <div className="panel-heading">
                                      <h4 className="panel-title">
                                          <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">{this.state.WeatherSummaries[1]}</a>
                                      </h4>
                                  </div>
                                  <div id="collapseOne" className="panel-collapse collapse">
                                      <div className="panel-body">{this.state.WeatherDetails[1]}</div>
                                  </div>
                              </div>
                              <div className="panel panel-default">
                                  <div className="panel-heading">
                                      <h4 className="panel-title">
                                          <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">{this.state.WeatherSummaries[2]}</a>
                                      </h4>
                                  </div>
                                  <div id="collapseTwo" className="panel-collapse collapse">
                                      <div className="panel-body">{this.state.WeatherDetails[2]}</div>
                                  </div>
                              </div>
                              <div className="panel panel-default">
                                  <div className="panel-heading">
                                      <h4 className="panel-title">
                                          <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree">{this.state.WeatherSummaries[3]}</a>
                                      </h4>
                                  </div>
                                  <div id="collapseThree" className="panel-collapse collapse">
                                      <div className="panel-body">{this.state.WeatherDetails[3]}</div>
                                  </div>
                              </div>
                              <div className="panel panel-default">
                                  <div className="panel-heading">
                                      <h4 className="panel-title">
                                          <a data-toggle="collapse" data-parent="#accordion" href="#collapseFour">{this.state.WeatherSummaries[4]}</a>
                                      </h4>
                                  </div>
                                  <div id="collapseFour" className="panel-collapse collapse">
                                      <div className="panel-body">{this.state.WeatherDetails[4]}</div>                                     
                                  </div>
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
