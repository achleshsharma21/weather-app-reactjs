import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

function Header(){
  return (
    <div>
      <div className="header"><h2 className="header-content">Weather App</h2></div>
      
    </div>
    
  )
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      Maxtemp: '',
      Mintemp: '',
      location: '',
      day: '',
      date: '',
      sunrise: '',
      sunset: '',
      CommentsList: [],
      cityName: '',
      loadingState: true,
      wind: '',
      humidity: '',
      pressure: '',
      src:false,
      weather: null,
      logo: '',
      weatherInfo: '',
      comment: '',
    };
  }

  addComment = event =>{
    this.setState({
      CommentsList: [...this.state.CommentsList,this.state.comment],
      comment:""
    });
  };

  bar = () =>{
    return (
      <div className="navbar">
        <input type="text" placeholder="Enter City Name..." onChange={()=>this.setCity(event)} value={this.state.cityName} />
        <button onClick={this.report}>Search</button>
        </div>
    )
  }


  handleChangeOfComment=event =>{
    this.setState({
      comment:event.target.value,
    });
  };

  render() {
    if(this.state.loadingState){
      return (<div>
        <Header />
        {this.bar()}
      </div>)
    }
    else if(this.state.src){
      return (<div>
        <Header />
        {this.bar()}
        <center><div className="search"><p>Searching City name...</p></div></center>
      </div>)
    }
    else if(this.state.weather.cod==404){
      return (<div>
        <Header />
        {this.bar()}
        <center><div className="notFound"><p>City Name not found</p></div></center>
      </div>)
    }
    else{
    return (
      <div>
        <Header/>

        {this.bar()}
        <center>
        <div className="container">
          <div className="time"><div>{this.state.location}, </div> <div>{this.load()}</div></div>

          <div className="content">
            <div className="temprature">
            <div>{Math.floor(this.state.weather.main.temp - 273)}°C</div>
            <div><img src={this.state.logo}  /></div>
            </div>
            <div>{this.otherContent()}</div>
          </div>

        </div>
        </center>
        {this.commentBox()}
      </div>
    );}
  }
  load = () =>{
    var today=new Date()
    var d=today.getDate()
    var day=''
    var mon=''
    var date=today.getDate()
    var year=today.getUTCFullYear();
    if(today.getDay()==1)
      day='Mon'
    else if(today.getDay()==2)
      day='Tues'
    else if(today.getDay()==3)
      day='Wed'
    else if(today.getDay()==4)
      day='Thu'
    else if(today.getDay()==5)
      day='Fri'
    else if(today.getDay()==6)
      day='Sat'
    else if(today.getDay()==7)
      day='Sun'
    
    if(today.getMonth()==1)
      mon='Jan'
    else if(today.getMonth()==2)
      mon='Feb'
    else if(today.getMonth()==3)
      mon='Mar'
    else if(today.getMonth()==4)
      mon='Apr'
    else if(today.getMonth()==5)
      mon='May'
    else if(today.getMonth()==6)
      mon='Jun'
    else if(today.getMonth()==7)
      mon='Jul'
    else if(today.getMonth()==8)
      mon='Aug'
    else if(today.getMonth()==9)
      mon='Sept'
    else if(today.getMonth()==10)
      mon='Oct'
    else if(today.getMonth()==11)
      mon='Nov'
    else if(today.getMonth()==12)
      mon='Dec'


    return (<div>{day} {mon} {date} {year}</div>)

  }


  otherContent = () =>{
    return(
      <div className="otherContent">
        <div>
          Weather: <b>{this.state.weatherInfo}</b><br />
          Wind: <b>{this.state.wind}</b>
        </div>
        <div>
          Humidity: <b>{this.state.humidity}</b><br />
          Pressure: <b>{this.state.pressure}</b>
        </div>
        <div>
          Max Temp: <b>{this.state.Maxtemp}</b><br />
          Min Temp: <b>{this.state.Mintemp}</b>
        </div>
        <div>
          Sunrise: <b>{this.state.sunrise}</b><br />
          Sunset: <b>{this.state.sunset}</b>
        </div>
      </div>
    )
  }

  setCity = (event) =>{
    this.setState({
      cityName: event.target.value,
        loadingState:false,
        src:true
    })
  };
  commentBox = () =>{
    return(
      <div className="Container1">
        <input onChange={event => this.handleChangeOfComment(event)}
      value={this.state.comment} placeholder="Enter your comment here..." /><br />
        <button onClick={this.addComment}>Comment</button>
        <div>
          Comments({this.state.CommentsList.length})<br/>
          
          {
            this.state.CommentsList.map(eachElm =>(
              <div className="listComments"><img src="https://png.pngtree.com/png-vector/20190423/ourmid/pngtree-user-icon-vector-illustration-in-glyph-style-for-any-purpose-png-image_975597.jpg" /> <p>{eachElm}</p></div>
            ))
          }
        </div>
      </div>
    )
  }
  report = async() =>{
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${this.state.cityName}&APPID=a6f343109ef53b76d5cc832083ddf99f`;
    const response = await fetch(url);
    const myJson = await response.json();
    console.log(myJson);
    this.setState({loadingState:false, weather:myJson, src:false})
    this.setState({location: myJson.name+", "+myJson.sys.country})
    this.setState({
      logo: "https://openweathermap.org/img/w/" + myJson.weather[0].icon + ".png",
      weatherInfo: myJson.weather[0].main,
      wind: myJson.wind.speed,
      humidity: myJson.main.humidity,
      pressure: myJson.main.pressure,
      Maxtemp: Math.floor(myJson.main.temp_max - 273)+"°C",
      Mintemp: Math.floor(myJson.main.temp_min - 273)+"°C",
    })
    var sr=myJson.sys.sunrise;
    sr=sunIndex(sr);
    var ss=myJson.sys.sunset;
    ss=sunIndex(ss);
    this.setState({
      sunset: ss,
      sunrise: sr
    })
  };

}
function sunIndex(sr){
    var obj=new Date(sr*1000);
    var d=obj.toUTCString();
    return d.slice(-12,-4);
}

render(<App />, document.getElementById('root'));
