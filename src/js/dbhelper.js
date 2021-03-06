/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * Common database helper functions.
 */

class DBHelper {
  // eslint-disable-line no-unused-vars
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }
  /**
   * Fetch all restaurants.
   */
  // static fetchRestaurants(callback) {
  //   // let xhr = new XMLHttpRequest();
  //   // xhr.open('GET', DBHelper.DATABASE_URL);
  //   // xhr.onload = () => {
  //   //   if (xhr.status === 200) {
  //   //     // Got a success response from server!
  //   //     const json = JSON.parse(xhr.responseText);
  //   //     const restaurants = json.restaurants;
  //   //     callback(null, restaurants);
  //   //   } else {
  //   //     // Oops!. Got an error from server.
  //   //     const error = `Request failed. Returned status of ${xhr.status}`;
  //   //     callback(error, null);
  //   //   }
  //   // };
  //   // xhr.send();

  //   fetch(DBHelper.DATABASE_URL)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw Error(
  //           `Request failed. Returned status of ${response.statusText}`
  //         );
  //       }
  //       const restaurants = response.json();
  //       return restaurants;
  //     })
  //     .then(restaurants => callback(null, restaurants))
  //     .catch(err => callback(err, null));

  //   /*
  //   fetch(DBHelper.DATABASE_URL)
  //     .then(response => response.json())
  //     .then(restaurants => callback(null, restaurants))
  //     .catch(err => callback(err, null));
  //   */
  // }

  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL)
      .then(response => {
        if (response.status === 200) {
          response
            .json()
            .then(json => callback(null, json))
            .catch(error => callback(error, null));
        } else {
          callback(
            `Request failed. Returned status of ${response.status}`,
            null
          );
        }
      })
      .catch(error => callback(error, null));
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) {
          // Got the restaurant
          callback(null, restaurant);
        } else {
          // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    callback
  ) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map(
          (v, i) => restaurants[i].neighborhood
        );
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter(
          (v, i) => neighborhoods.indexOf(v) == i
        );
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter(
          (v, i) => cuisines.indexOf(v) == i
        );
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    let url = `/img/${restaurant.photograph || restaurant.id}-300.png`;
    return url;
  }

  /**
   * Homepage image srcset
   */
  static imageSrcsetForRestaurant(restaurant) {
    // return `${restaurant.photograph}`;
    const imgSrc = `/img/${restaurant.photograph || restaurant.id}`;
    return `${imgSrc}-300.png 300w,
    ${imgSrc}-600.png 600w,
    ${imgSrc}-800.png 800w`;
  }

  static imageSizesForRestaurant(restaurant) {
    return `(max-width: 360px) 280px,
    (max-width: 600px) 600px,
    400px`;
  }

  /**
   * Reviews image srcset
   */
  static imageSrcsetForReviews(restaurant) {
    return `${restaurant.srcset_restaurant}`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker(
      [restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      }
    );
    marker.addTo(map);
    return marker;
  }
  //https://alexandroperez.github.io/mws-walkthrough/
  static mapOffline() {
    const map = document.getElementById('map');
    map.className = 'map-offline';
    map.innerHTML = `<div class="warning-icon">!</div>
    <div class="warning-message">Maps is haven't trouble loading..</div>
    <div class="warning-suggestion">You appear to be offline. To access maps, connect to a network.</div>`;
  }

  /**
   * Fetch reviews for a restaurant.
   */
  static fetchReviewsForRestaurant(id, callback) {
    fetch('http://localhost:1337/reviews/?restaurant_id=' + id)
      .then(response => {
        if (response.status === 200) {
          response
            .json()
            .then(json => {
              callback(null, json);
            })
            .catch(err => {
              callback(err, null);
            });
        } else {
          callback(
            `Request failed. Returned status of ${response.status}`,
            null
          );
        }
      })
      .catch(err => {
        callback(err, null);
      });
  }
}
