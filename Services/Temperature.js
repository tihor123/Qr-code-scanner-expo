export const FectCityDetails = (city, successCall) =>{
    var api = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=5582390c71d57a2b87d50a452746f1df";
    fetch(api,{method:'POST'})
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      successCall(json)
    })
    .catch((error) => {
      console.error(error);
    });

    //fetch(api,{method:'GET'})
}