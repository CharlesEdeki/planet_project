const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

// function to check if the planet is habitable
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
    && planet['koi_insol'] > 0.36 
    && planet['koi_insol'] < 1.11 
    && planet['koi_prad'] < 1.6
}

// streaming the csv file and pushing the data to the results array
fs.createReadStream('keplers_dataset.csv')
    .pipe(parse({  // using the csv-parse package
        comment: '#', // ignoring the comments
        columns: true // using the first row as the header
    }))
    .on('data', (data) => {
        if (isHabitablePlanet(data)){ // checking if the planet is habitable
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log(err); // handling error
    })
    .on('end', () => {
        console.log(habitablePlanets.map((planet) => { // mapping the habitable planets
            return [planet['kepler_name'], planet['koi_insol'], planet['koi_prad'], planet['koi_steff']]; // returning the name of the planet
        }));
        console.log(`${habitablePlanets.length} habitable planets found!`); // logging the number of habitable planets
    });