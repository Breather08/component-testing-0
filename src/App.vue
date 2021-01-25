<template>
  <div id="app">
    <PromotionEdit />
  </div>
</template>

<script>
import PromotionEdit from "./components/PromotionEdit.vue";

export default {
  name: "App",
  components: {
    PromotionEdit
  },
  data() {
    return {
      promotion: {
        pk: "test_pk",
        header: "test_header",
        image: "test_src",
        restaurant: {
          pk: "5fdf69064ec63c1a82d11be8",
          title: "Coffee Boom VD",
          categories: [],
          logo:
            "https://chocofood.kz/media/site/restaurants/logo/cofeeboom.jpg",
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
        },
        type_name: "discount",
        promotion_type: {
          discount_type: "percent",
          food_ids: ["5fe26d84f16c6fc96e064a08"],
          amount: 10
        },
        started_at: "2020-12-22T18:00:00+00:00",
        ended_at: "2020-12-23T17:59:00+00:00",
        description: "Успей заказать со скидкой 10%"
      }
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
