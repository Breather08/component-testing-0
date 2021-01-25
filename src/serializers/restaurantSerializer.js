class Restaurant {
  constructor(restaurant) {
    Object.keys(restaurant).forEach((key) => {
      this[key] = restaurant[key];
    });
  }
}

export const serializeRestaurant = (restaurant) => new Restaurant(restaurant);
