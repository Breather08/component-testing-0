import Vue from "vue";
import { nextTick } from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import PromotionEdit from "@/components/PromotionEdit.vue";
import { Promotion } from "@/serializers/promotionSerializer";

jest.mock("moment", () => (arg) => ({
  utc: () => ({
    toISOString: () => "2020-12-24T00:00:00+00:00"
  }),
  format: () => (arg ? "2020-12-24" : "now")
}));

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
    amount: "Нур-Султан (Астана), улица Кенесары, 22"
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

  it("should render properly", () => {
    expect(wrapper.find(".restaurant-wrapper").exists()).toBeTruthy();
    expect(wrapper.find(".input-title").exists()).toBeTruthy();
    expect(wrapper.find(".input-description").exists()).toBeTruthy();
    expect(wrapper.find(".preview_image").exists()).toBeTruthy();
    expect(wrapper.find(".default-btn").exists()).toBeTruthy();
    expect(wrapper.find(".calendar-input").exists()).toBeTruthy();
  });

  it("should handle savePromotion on click", () => {
    wrapper.find(".btn-save").trigger("click");
    expect(wrapper.emitted("save").length).not.toBe(0);
  });

  it("should handle promotion watcher properly", async () => {
    wrapper.setProps({
      promotion: { ...promotion, header: "new-test-header" }
    });

    await nextTick();

    expect(wrapper.vm.$data.header).toEqual("new-test-header");
  });

  it("should update models correctly", async () => {
    const triggerInput = (className, tag, testValue) => {
      const input = wrapper.find(`.${className} ${tag}`);
      input.element.value = testValue;
      input.trigger("input");
    };

    // image
    triggerInput("image-input", "input", "some_image");

    // promotionDescription
    triggerInput(
      "information-type__description",
      "textarea",
      "some_description"
    );

    // promotionType.amount
    triggerInput("discount-type__amount-input", "input", 15);

    // startedAt
    triggerInput("calendar-input.start-date", "input", "some_date");

    // endedAt
    triggerInput("calendar-input.end-date", "input", "some_date");

    await nextTick();

    expect(wrapper.vm.$data.image).toEqual("some_image");
    expect(wrapper.vm.$data.promotionDescription).toEqual("some_description");
    expect(wrapper.vm.$data.promotionType.amount).toEqual("15");
    expect(wrapper.vm.$data.startedAt).toEqual("some_date");
    expect(wrapper.vm.$data.endedAt).toEqual("some_date");
  });

  it("should setup defaults correctly", async () => {
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

    wrapper.setProps({ promotion: undefined });

    await nextTick();

    expect(data.header).toEqual("");
    expect(data.image).toBeNull();
    expect(data.restaurant).toBeNull();
    expect(data.promotionTypeName).toEqual("informational");
    expect(data.promotionDescription).toEqual("");
    expect(data.promotionType).toEqual({});
    expect(data.startedAt).toEqual("now");
    expect(data.endedAt).toEqual("now");
  });
});
