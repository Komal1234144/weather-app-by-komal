import React, { useState , useReducer} from 'react';
import moment from 'moment';
import './App.css'
const App = () =>{

  let api = {
    accessToken : 'pk.eyJ1Ijoia29tYWwtMDUiLCJhIjoiY2tzeTlibjlyMW5peTMxbHN5N21nY3pneSJ9.CYcpz-_skE6A8vuzUB390A',
    apikey : "58d23fcf51bf6dbdd7f833f427026991"
  }

  const ACTIONS = {
    SET_ERROR : 'SET_ERROR',
    SET_PLACE : 'SET_PLACE',
    SET_TEMP : 'SET_TEMP',
    SET_DESC : 'SET_DESC'
  }

  function reducer(state , action){
     switch(action.type){
       case ACTIONS.SET_ERROR : 
         return {...state , error : action.payload.error}
       case ACTIONS.SET_PLACE : 
         return {...state , place : action.payload.place}
      case ACTIONS.SET_TEMP : 
        return {...state , temp : action.payload.temp}
      case ACTIONS.SET_DESC : 
        return {...state , desc : action.payload.desc}
      default :
         return state;
     }
  }
 let time = moment().format('dddd, MMMM Do YYYY')
//  let [temp , setTemp] = useState('')
//  let [currDate , setCurrDate] = useState(time)
//  let [place , setPlace] = useState();
//  let [desc , setDesc] = useState('');
//  let [error , setError] = useState('')
 const [state , dispatch] = useReducer(reducer , 
  { temp : '',
    currDate : time,
    desc : '',
    place : '',
    error : ''
 })
  const onClick=(e)=>{
    e.preventDefault();
   
    let value = e.target.previousSibling.value;
    if(value === ''){
      return dispatch({ type : ACTIONS.SET_ERROR , payload : { error : 'Type a location'}})
    }
    let city = value.replace(value[0] , value[0].toUpperCase())
    
    fetch( `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${api.accessToken}`)
               .then((response)=>response.json())
               .then((json)=>{
                if(json.features.length === 0){
                  return dispatch({ type : ACTIONS.SET_ERROR , payload : { error : 'City not found'}})
                } 
                dispatch({ type : ACTIONS.SET_ERROR , payload : { error : ''}})
                  let place = json.features[0].place_name
                  let lat = json.features[0].center[1]
                  let lon = json.features[0].center[0]
                  fetchtemp(place , lat , lon)
               } )
   
  }

  const fetchtemp =(place , lat , lon)=>{
   
   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=58d23fcf51bf6dbdd7f833f427026991`

  )
    .then((response)=>{  return(response.json())})
    .then((json)=> {
    //  if(json.cod === '404'){
    //    setError(json.message)
    //    setPlace('')
    //    setTemp('')
    //    setDesc('')
    //  } else{
    let temp; 
    if(json.main.temp <= 0.49 && json.main.temp >= 0){  
      temp = 1}
    else if(json.main.temp >= -1.49 && json.main.temp <= 0){
      temp = -1
    } else{
      temp = Math.round(json.main.temp)
    }
     console.log(temp)
     console.log(typeof(temp))
     dispatch({ type : ACTIONS.SET_PLACE , payload : { place : place}})
     dispatch({ type : ACTIONS.SET_TEMP , payload : { temp : temp}})
     let desc ;
     temp === 0 ? desc = 'Freeze' :
     temp <= 20 && temp >=-100? desc = 'Freeze':
     temp>=20 && temp<=25 ? desc = 'Cold':
     temp>=25 && temp<=28 ? desc = 'Normal' :
     temp >= 28 && temp <=30 ? desc = 'Normal' : 
     temp>=30 && temp<= 33 ? desc = 'Warm' :
     temp >33 ? desc = 'Hot'  : desc = ''
     console.log(desc)
     dispatch({ type : ACTIONS.SET_DESC , payload : { desc : desc}})
     background(desc) 
    //}
    })
  }

  const background=(desc)=>{
    
    const root = document.getElementById('root');
    
    desc==='Freeze' ? root.className = 'cold' :
    desc==='Cold' ? root.className = 'cold' :
    desc === 'Normal' ? root.className = 'hot' :
    desc === 'Warm' ? root.className = 'hot' :
    desc === 'Hot' ? root.className = 'hot' : 
    root.className = 'plain'   
   
  }

  return(
    <div className='app'>
    <form className='form'>
       <input 
       id='input' 
       type='text'
        placeholder='Type location'
        autoFocus
        autoComplete='off'
        autoCorrect='true'
        spellCheck='true'
        required/>
        <button 
        
        onClick={onClick}>Search</button>
    </form>   
        <div id='info'>
           {state.error && state.error } 
           <p>{state.currDate}</p>
           <p>{state.place}</p> 
            {state.temp && <div id='temp'>{state.temp}°C</div> }
            <p>{state.desc}</p>
         </div>
    </div>
  )
}

export default App;