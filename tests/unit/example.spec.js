import Vue from "vue";
import { nextTick } from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import PromotionEdit from "@/components/PromotionEdit.vue";
import { Promotion } from "@/serializers/promotionSerializer";
import moment from "moment";

jest.mock("moment", () => () => ({
  utc: () => ({
    toISOString: () => "2020-12-24T00:00:00+00:00"
  }),
  format: () => "2020-12-24"
}));

// Vue.config.silent = true;

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

Vue.use(Vuetify);
const localVue = createLocalVue();

describe("PromotionEdit.vue", () => {
  let wrapper;
  const vuetify = new Vuetify();
  beforeEach(() => {
    wrapper = mount(PromotionEdit, {
      localVue,
      vuetify,
      propsData: {
        promotion: new Promotion(promotion)
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

  // uncompleted
  it("should handle promotion watcher properly", async () => {
    const setupDefaults = jest.fn();
    wrapper.setMethods({ setupDefaults });

    // wrapper.vm.promotion = { ...promotion, header: "test-header" };
    wrapper.setProps({ header: "new-test-header" });
    console.log(wrapper.vm.$props.promotion.header);
    console.log(wrapper.vm.promotion.header);

    await nextTick();

    expect(setupDefaults).toBeCalled();
  });

  // mock moment then
  it("should setup defaults correctly", () => {
    const formattedDate = "2020-12-24";
    const data = wrapper.vm.$data;
    expect(data.header).toEqual(promotion.header);
    expect(data.image).toEqual(promotion.image);
    expect(data.restaurant).toEqual(promotion.restaurant);
    expect(data.promotionTypeName).toEqual(promotion.type_name);
    expect(data.promotionDescription).toEqual(promotion.description);
    expect(data.promotion_type).toEqual(promotion.promotionType);
    expect(data.startedAt).toEqual(formattedDate);
    expect(data.endedAt).toEqual(formattedDate);
  });
});
