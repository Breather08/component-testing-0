import { mount } from "@vue/test-utils";
import PromotionEdit from "@/components/PromotionEdit.vue";
import {
  discountPromotion,
  informationalPromotion,
  promotionTypes,
  Promotion,
  discountTypes
} from "@/serializers/promotionSerializer";

const restaurant = {
  pk: "5fdf69064ec63c1a82d11be8",
  title: "Coffee Boom VD",
  categories: [],
  logo: "https://chocofood.kz/media/site/restaurants/logo/cofeeboom.jpg",
  image:
    "https://chocofood.kz/media/site/restaurants/card_image/cart_zz07Z4P.jpg",
  delivery_service: "VD",
  state: "active",
  location: {
    coordinate: {
      latitude: 51.163844,
      longitude: 71.416981
    },
    text: "Нур-Султан (Астана), улица Кенесары, 22"
  },
  payment_types: {
    cash: true,
    bonus: true,
    card: true,
    rakhmet: true
  },
  synonyms: [],
  schedule: [
    {
      started_weekday: "monday",
      started_at: {
        hour: 8,
        minute: 0
      },
      ended_weekday: "monday",
      endedAt: {
        hour: 23,
        minute: 0
      }
    }
  ]
};

const promotion = {
  pk: "test_pk",
  header: "test_header",
  image: "test_src",
  restaurant,
  type_name: "discount",
  promotion_type: {
    discount_type: "percent",
    food_ids: ["5fe26d84f16c6fc96e064a08"],
    amount: 10
  },
  started_at: "2020-12-22T18:00:00+00:00",
  ended_at: "2020-12-23T17:59:00+00:00",
  description: "Успей заказать со скидкой 10%"
};

const emptyData = {
  promotionTypes,
  discountPromotion,
  informationalPromotion,
  startedAtMenu: false,
  endedAtMenu: false,
  header: "",
  image: null,
  restaurant: null,
  promotionTypeName: null,
  promotionType: null,
  startedAt: null,
  endedAt: null,
  discountTypesList: discountTypes,
  promotionDescription: null
};

describe("PromotionEdit.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(PromotionEdit, {
      propsData: {
        promotion: new Promotion(promotion)
      },
      data() {
        return { ...emptyData };
      }
    });
  });

  it("should initialize correctly", () => {
    expect(wrapper.vm._props.promotion).toBeTruthy();
    expect(wrapper.vm._data.promotionTypes).toBeTruthy();
  });

  it("should handle savePromotion on click", () => {
    wrapper.find(".btn-save").trigger("click");
    expect(wrapper.emitted("save").length).not.toBe(0);
  });

  it("should handle promotion watcher properly", () => {
    let counter = 0;
    wrapper.setMethods({ setupDefaults: jest.fn(() => counter++) });
    expect(counter).toBe(0);
    wrapper.vm.$options.watch.promotion.call(wrapper.vm);
    expect(counter).not.toBe(0);
  });
});
