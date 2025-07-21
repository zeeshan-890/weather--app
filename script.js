


const citycontry = document.querySelector('.city')
const search = document.getElementById('search')
const currimg = document.getElementById('atmimg')
const disimg = document.getElementById('disimg')
const atmtxt = document.querySelector('.atmospheretext')
const disptime = document.querySelector('.time')
const disdate = document.querySelector('.date')
const disday = document.querySelector('.day')
const humval = document.querySelector('.humval')
const pval = document.querySelector('.pval')
const wval = document.querySelector('.wval')
const uvval = document.querySelector('.uvval')
const temp = document.querySelector('#temp')
const dislocs = document.querySelector('.displayloc')
const sec2 = document.querySelector('.card-list')
const sunrise = document.querySelector('.sunrisetime')
const sunset = document.querySelector('.sunsettime')
const curloc = document.getElementById('curloc')
const hodate = document.querySelector('.hodate')
const hoday = document.querySelector('.hoday')

const hourlycontainer = document.querySelector(".hourly-container")


let debounceTimeout
let latitude
let longitude

let timezone


window.addEventListener("DOMContentLoaded", async function () {
    let latitude = 30.83;
    let longitude = 71.9


    dislocs.innerHTML = ""
    sec2.innerHTML = ""
    hourlycontainer.innerHTML = "";
    const data = await getweatherdata(latitude, longitude)


    displaycurrentdata(data)
    displaydailydata(data)

    displayhourlydata(data.forecast.forecastday)
    gethourlydata(0, data.forecast.forecastday)

});

const getweatherdata = async (lat, lon) => {

    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b222f1ac78f349f1b8482217252506&q=${lat} ${lon}&days=14&aqi=no&alerts=no`)

    const data = await response.json()

    return data

}





const fetchlocation = async (adress) => {
    const locationapiurl = `https://geocode.maps.co/search?q=${encodeURIComponent(adress)}&api_key=685baa69ec2a2304112270wqb0d395c`
    const response = await fetch(locationapiurl)
    const locationdata = await response.json()

    locationdata.slice(0, 4).forEach((element, index) => {

        const newloc = document.createElement('div')
        newloc.innerText = element.display_name
        newloc.classList.add('locitem')
        dislocs.append(newloc)
        // console.log(index,dislocs);

    })






    Array.from(dislocs.children).forEach((e, i) => {


        e.addEventListener('click', async () => {

            latitude = locationdata[i].lat
            longitude = locationdata[i].lon
            dislocs.innerHTML = ""
            sec2.innerHTML = ""
            const data = await getweatherdata(latitude, longitude)


            displaycurrentdata(data)
            displaydailydata(data)

            displayhourlydata(data.forecast.forecastday)
            gethourlydata(0, data.forecast.forecastday)






            // const daily = await display(latitude, longitude, '1d')
            // display5days(daily)
            // console.log(timezone);
            //   display(latitude,longitude,'1h')
        })

    })

}

search.addEventListener('input', (e) => {

    clearTimeout(debounceTimeout);
    dislocs.innerHTML = ""

    debounceTimeout = setTimeout(async () => {
        const query = search.value.trim();
        if (!query) return;
        fetchlocation(query)



    }, 500);

});

function convertToAMPM(time24) {
    const [hoursStr, minutes] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // convert '0' to '12'
    return `${hours}:${minutes} ${ampm}`;
}



function displaydailydata(dat) {

    console.log(dat);

    // Clear previous cards to avoid duplicates or empty cards
    sec2.innerHTML = "";


    dat.forecast.forecastday.forEach((e, index) => {

        console.log(e, index);
        if (index == 0) {
            sunrise.textContent = e.astro.sunrise
            sunset.textContent = e.astro.sunset

        }

        // Extract data for the card
        const date = e.date;
        const dayName = getDayname(date);
        const [year, month, day] = date.split("-");
        const formattedDate = `${day}-${month}-${year}`;
        const condition = e.day.condition;
        const icon = condition.icon
        const text = condition.text;
        const tempMax = e.day.maxtemp_c;
        const tempAvg = e.day.avgtemp_c;
        const tempMin = e.day.mintemp_c;
        const wind = e.day.maxwind_kph;
        const humidity = e.day.avghumidity;
        const uv = e.day.uv;

        const newel = document.createElement('li');
        newel.classList.add('card-item');
        newel.classList.add('swiper-slide');
        newel.innerHTML = `  
                             <a class="card-link">
                                <div class="dailyday">${dayName}</div>
                                <div class="dailydate">${formattedDate}</div>

                                <div class="dailyatmosphere">
                                    <div class="dailysun">
                                        <img id="dailyatmimg" src="${icon}" alt="">
                                    </div>
                                    <div class="dailyatmospheretext">${text}</div>
                                </div>
                                <div class="tempcontainer">
                                    <div class="tempmaxval">
                                        <strong>${tempMax} &deg;C</strong>
                                        <span>Max</span>
                                    </div>
                                    <div class="tempavgval">
                                        <strong>${tempAvg} &deg;C</strong>
                                        <span>Avg</span>
                                    </div>
                                    <div class="tempminval">
                                        <strong>${tempMin} &deg;C</strong>
                                        <span>Min</span>
                                    </div>
                                </div>
                                <div class="hwu">
                                    <div class="dailywind">
                                        <strong>${wind} <span>km/h</span></strong>
                                        <span>Wind</span>
                                    </div>
                                    <div class="dailyhum">
                                        <strong>${humidity}<span>%</span></strong>
                                        <span>Humidity</span>
                                    </div>
                                    <div class="dailyUv">
                                        <strong>${uv}</strong>
                                        <span>UV Index</span>
                                    </div>
                                </div>
                            </a>
                                            `;

        sec2.append(newel);
    });




}


function displayhourlydata(dailydata) {
    Array.from(sec2.children).forEach((e, i) => {


        e.addEventListener('click', async () => {
            hourlycontainer.innerHTML = ""
            gethourlydata(i, dailydata)

        })

    })

}


function gethourlydata(i, dailydata) {

    hourlycontainer.innerHTML = ""
    const requireddata = dailydata[i];
    let hourlydate = requireddata.date
    let hourdata = requireddata.hour




    hodate.textContent = `${changedateformat(hourlydate)}`
    hoday.textContent = `${getDayname(hourlydate)}`



    Array.from(hourdata).forEach(e => {


        const [dat, tim] = e.time.split(' ')




        const hourlydata = document.createElement('div')
        hourlydata.classList.add('hourly-data')
        hourlydata.innerHTML = ` <div class="hourlytime"><strong>${convertToAMPM(tim)}</strong></div>
                <div class="hourlyvalues">
                    <div class="hourlytemp">
                        <strong>${e.temp_c} &deg;C</strong>
                        <span>Temp </span>
                    </div>
                    <div class="hourlyhumidity">
                        <strong>${e.humidity} <span>%</span></strong>
                        <span>Humidity</span>
                    </div>
                    <div class="hourlywind">
                        <strong>${e.wind_kph} 
                        <span> km/h</span></strong>
                        <span>Wind</span>
                    </div>
                    <div class="hourlypressure">
                        <strong>${e.pressure_in} <span>Pa</span></strong>
                        <span>Pressure</span>
                    </div>
                    <div class="hourlydew">
                        <strong>${e.dewpoint_c} <span>%</span></strong>
                        <span>Dew</span>
                    </div>
                </div>`

        hourlycontainer.append(hourlydata)
    })

}





function displaycurrentdata(data) {



    const loc = data.location
    const curr = data.current

    citycontry.textContent = `${loc.name} , ${loc.country}`

    currimg.src = curr.condition.icon
    atmtxt.textContent = `${curr.condition.text}`
    const time = loc.localtime

    const [newdate, newtime] = time.split(" ")

    disptime.textContent = `${convertToAMPM(newtime)}`
    const [fyear, fmonth, fdate] = newdate.split("-")
    disdate.textContent = `${fdate}-${fmonth}-${fyear}`




    disday.textContent = `${getDayname(newdate)}`
    humval.textContent = `${curr.humidity} %`
    pval.textContent = `${curr.pressure_in} Inch`
    wval.textContent = `${curr.wind_kph} Km/h`
    uvval.textContent = `${curr.uv} `
    temp.textContent = `${curr.temp_c} `



}


function getDayname(date) {
    const dte = new Date(date)


    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[dte.getDay()];
    return dayName
}




const changetime = (datetime) => {

    const newtime = new Date(datetime)

    const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit'
    }).format(newtime)

    console.log('formatted: ', formatted);
    return formatted


}

function changedateformat(changeabledate) {
    let datearray = changeabledate.split("-")

    const [year, mon, date] = datearray
    return `${date}-${mon}-${year}`
}






























// Array.from(dislocs).forEach((el) => {
//     console.log(el);
// })


// let debounceTimeout
// async function fetchdata(query) {
//      const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=b222f1ac78f349f1b8482217252506&q=${encodeURIComponent(query)}&aqi=no`)

//         const dt = await res.json();
//         const loc = dt.location
//         const curr = dt.current
//         console.log(dt);
//         citycontry.textContent = `${loc.name} , ${loc.country}`
//         console.log(curr);
//         currimg.src = curr.condition.icon
//         atmtxt.textContent = `${curr.condition.text}`
//         const time = loc.localtime
//         console.log(time);
//         const [newdate, newtime] = time.split(" ")
//         console.log(newdate)
//         console.log(newtime)
//         disptime.textContent = `${newtime}`
//         const [fyear, fmonth, fdate] = newdate.split("-")
//         disdate.textContent = `${fdate}-${fmonth}-${fyear}`


//         const dte = new Date(newdate)
//         console.log(dte.getDay());

//         const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//         const dayName = days[dte.getDay()];

//         disday.textContent = `${dayName}`
//         humval.textContent=`${curr.humidity} %`
//         pval.textContent=`${curr.pressure_in} Inch`
//         wval.textContent=`${curr.wind_kph} Km/h`
//         uvval.textContent=`${curr.uv} `
//         temp.textContent=`${curr.temp_c} `
//         console.log(curr.uv);


// }

// // window.addEventListener('DOMContentloaded',()=>{
// //     console.log('loading');

// //     fetchdata('jhang')

// // })

// // window.onload = () => {

// //     fetchdata('jhang')
// // };




curloc.addEventListener('click', async () => {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            dislocs.innerHTML = ""
            sec2.innerHTML = ""
            hourlycontainer.innerHTML = ""
            const data = await getweatherdata(latitude, longitude)


            displaycurrentdata(data)
            displaydailydata(data)
            console.log(sec2.children);
            displayhourlydata(data.forecast.forecastday)
            gethourlydata(0, data.forecast.forecastday)

        },
        (err) => {
            console.error("Location error:", err);
        }
    );

})

// search.addEventListener('input', (e) => {
//     clearTimeout(debounceTimeout);
//     debounceTimeout = setTimeout(async () => {
//         const query = search.value.trim();
//         if (!query) return;
//         fetchdata(query)


//     }, 500);
// });



// async function display(latitude, longitude, interval) {
//     const mainurl = `https://tomorrow-io1.p.rapidapi.com/v4/weather/forecast?location=${latitude}%2C${longitude}&timesteps=${interval}`
//     const response = await fetch(mainurl, {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-host': 'tomorrow-io1.p.rapidapi.com',
//             'x-rapidapi-key': '4c77181167msh7d7630b9966fb05p12ac4cjsn754f385985e9'
//         }
//     })
//     const data = await response.json()
//     return data

// }

const swiper = new Swiper('.card-wrapper', {
    // Optional parameters
    //   direction: 'horizontal',
    loop: false,
    spaceBetween: 60,
    slideCentered: true,


    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true

    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        0: {
            slidesPerView: 1

        },
        800: {
            slidesPerView: 2

        },
        1200: {
            slidesPerView: 3

        }
    }

    // And if we need scrollbar
    //   scrollbar: {
    //     el: '.swiper-scrollbar',
    //   },
});




