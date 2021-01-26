class Restaurant {
  constructor(restaurant) {
    this.pk = restaurant ? restaurant.pk : null;
    this.title = restaurant ? restaurant.title : "";
    this.categories = restaurant ? restaurant.categories : null;
    this.logo = restaurant.logo ? restaurant.logo : null;
    this.image = restaurant.image ? restaurant.image : null;
    this.delivery_service = restaurant.delivery_service
      ? restaurant.delivery_service
      : "";
    this.state = restaurant ? restaurant.state : "";
    this.location = restaurant ? restaurant.location : null;
    this.payment_types = restaurant ? restaurant.payment_types : null;
    this.synonyms = restaurant ? restaurant.synonyms : null;
    this.schedule = restaurant ? restaurant.schedule : null;
  }
}

export const serializeRestaurant = (restaurant) => new Restaurant(restaurant);
