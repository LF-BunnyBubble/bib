const axios = require('axios');
const cheerio = require('cheerio');



module.exports.get_numberOfPages = async (url) => {

  var indexPage = 1;
  while (true) {
    const response = await axios(url + indexPage);
    const { data, status } = response;
    const $ = cheerio.load(data);
    const indexRestaurant = $('.js-restaurant__stats > h1:nth-child(1) > span:nth-child(1)').text().trim().split('-');
    //console.log("TEST ==> INDEX OF RESTAURANTS"+indexRestaurant);
    
    if (Number(indexRestaurant[0])>Number(indexRestaurant[1])) {
      indexPage--;
      break;
    };
    
    indexPage++;
  }
  
  console.log("TEST ==> NUMBER OF PAGES ("+url+"): "+indexPage);

  return indexPage;
}

/**
-JSON format-
{
  "@context": "http://schema.org",
  "@type":"Restaurant",
  "adress":{
      "City":"",
      "Region":"",
      "postalCode":"",
      "streetAdress":""  
  },
  "contact":{
      "emailAdress":"",
      "phoneNumber":""  
  },
  "cuisine":{
    "foodType":"",
    "priceRange":"",
    "rating":"",
  }
}
**/



/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  const experience = $('#experience-section > ul > li:nth-child(2)').text();
  const TEST = $('#experience-section > ul > li:nth-child(1)').text();
  const TEST2= $('.restaurant-details__services--content').text();

  return {name, experience, TEST, TEST2};

};

/*
const parseBibResultsPage = data => {
  const domain = "https://guide.michelin.com";
  const $ = cheerio.load(data);
  var links = [];
  $('.link').each((index, value) => {
    var link = $(value).attr('href');
    links.push(domain + link);
  });
  return links;
};
*/

/**
 * Run through all pages to get all links of restaurants
 * @param  {int}  numberOfPages
 * @return {Array} restaurantsUrls
 */
module.exports.get_listOfLinks = async (numberOfPages) => {

  const url = "https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/";
  let listOfLinks = [];

  for (let i = 1; i <= numberOfPages; i++) {

    const response = await axios(`${url}${i}`);
    const { data, status } = response;

    if (status >= 200 && status < 300) {
      const $ = cheerio.load(data);
      $('.link').each((index, value) => {
        let link = $(value).attr('href');
        //console.log("TEST ==> RESTAURANT LINK: "+ link);
        
        listOfLinks.push(`https://guide.michelin.com${link}`);
      });
    }

    else console.error(status);
  }
  return listOfLinks;
};


module.exports.parseBibResultsPage = data => {
  const domain = "https://guide.michelin.com";
  const $ = cheerio.load(data);
  var links = [];
  $('.link').each((index, value) => {
    var link = $(value).attr('href');
    links.push(domain + link);
  });
  return links;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrap_dataOfRestaurants = async (link, listOfRestaurants) => {
  const response = await axios(link);
  const { data, status } = response;

  if (status >= 200 && status < 300) {
    const $ = cheerio.load(data)

    const name = $('.section-main h2.restaurant-details__heading--title').text();

    let address = $('.fa-map-marker-alt').closest('li').text();
    address= address.slice(0,address.length/2);

    let phone = 'n/a';
    if ($('.link').attr("href")) {
      phone = '+' + $('.link').attr("href").replace(/[^0-9]/g, '');
    };

    const priceAndCookingType = $('.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li.restaurant-details__heading-price').text().trim().replace(/\s+/g, ' ').split("•");
    //console.log(priceAndCookingType);
    const price = priceAndCookingType[0];    
    //console.log(price);
    let type =  priceAndCookingType[1];
    //console.log(type);
    type= type.replace(/\s+/g, " ");
    //console.log(type);
    const distinction = 'Bib Gourmand';
    

    const restaurant = {
      name: name,
      address: address,
      phone: phone,
      price: price,
      type: type,
      distinction: distinction
    };

    listOfRestaurants.push(restaurant);
  }

  else console.error(status);

  return null;
};



console.log("\n===> End of michelin.js");