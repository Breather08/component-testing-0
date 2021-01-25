import { serializeRestaurant } from "@/serializers/restaurantSerializer";
import moment from "moment";

export const informationalPromotion = "informational";
export const discountPromotion = "discount";
export const promotionTypes = {
  [informationalPromotion]: "Информационная",
  [discountPromotion]: "Скидка"
};

export const percentDiscountPromotion = "percent";
export const fixedDiscountPromotion = "fixed";
export const discountTypes = {
  [percentDiscountPromotion]: "%",
  [fixedDiscountPromotion]: "тг."
};

export const serializePromotionType = (typeName, detail) => {
  let promotionType = {};
  if (typeName === discountPromotion) {
    promotionType = {
      discountType: detail
        ? detail.discount_type || detail.discountType
        : percentDiscountPromotion,
      foodIds: detail ? detail.food_ids || detail.foodIds : [],
      amount: detail ? detail.amount : null
    };
  }
  return promotionType;
};

export const deserializePromotionType = (typeName, promotionType) => {
  let promotionTypeData = {};
  if (typeName === discountPromotion) {
    promotionTypeData = {
      discount_type: promotionType.discountType,
      food_ids: promotionType.foodIds.map((el) => el.oid || undefined),
      amount: promotionType.amount
    };
  }
  return promotionTypeData;
};

export class Promotion {
  constructor(promotion) {
    this.pk = promotion ? promotion.pk : null;
    this.header = promotion ? promotion.header : "";
    this.image = promotion ? promotion.image : null;
    this.restaurant = promotion
      ? serializeRestaurant(promotion.restaurant)
      : null;
    this.typeName = promotion ? promotion.type_name : null;
    this.promotionType = serializePromotionType(
      this.typeName,
      promotion ? promotion.promotion_type : null
    );
    this.startedAt = promotion ? promotion.started_at : "";
    this.endedAt = promotion ? promotion.ended_at : "";
    this.description = promotion ? promotion.description : "";
  }

  get typeDescription() {
    return promotionTypes[this.typeName];
  }

  get isActive() {
    const currentTime = moment(new Date(), "YYYY-MM-DD HH:mm")
      .utc()
      .toISOString(true);
    return this.startedAt < currentTime && this.endedAt > currentTime;
  }

  get deserialized() {
    return {
      header: this.header,
      image: this.image,
      restaurant_id: this.restaurant.pk,
      type_name: this.typeName,
      promotion_type: deserializePromotionType(
        this.typeName,
        this.promotionType
      ),
      started_at: this.startedAt,
      ended_at: this.endedAt,
      description: this.description
    };
  }
}

export const serializePromotion = (promotion) => new Promotion(promotion);

export const serializePromotionList = (promotions) =>
  promotions.map(serializePromotion);
