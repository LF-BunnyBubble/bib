
const michelin = require('./michelin');
const maitres = require('./maitre');

const fs = require('fs');

//const restaurants = michelin.get();

//restaurants.forEach(restaurant => {
//  console.log(restaurant.name);
//})

async function sandbox (searchLink) {
  try {


    //-MICHELIN-
    console.log("BROWSING ===> https://guide.michelin.com/fr/fr/restaurants/bib-gourmand");
    const numberOfPages = await michelin.get_numberOfPages("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/")
    
    //const numberOfPages = 1;
    console.log("RETRIEVING ===> links of michelin restaurants");
    const listOfLinks = await michelin.get_listOfLinks(numberOfPages); 
    
    console.log("RETRIEVING ===> data of michelin restaurants");
    let listOfRestaurants = [];
    for (link of listOfLinks){
       await michelin.scrap_dataOfRestaurants(link, listOfRestaurants); 
      }

    console.log("WRITING ===> bibGourmand.json");
    const jsonOfbibGourmand= await JSON.stringify(listOfRestaurants, null, 2);
    fs.writeFileSync('./bibGourmand.json', jsonOfbibGourmand);



    process.exit(0);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;

const michelinDefaultSearch = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/';



sandbox();
console.log("\n===> End of sandbox.js");