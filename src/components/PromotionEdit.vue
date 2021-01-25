<template>
  <div>
    <v-divider></v-divider>
    <div class="d-flex flex-column my-4">
      <editable-title
        class="title-view"
        v-model="header"
        placeholder="Новая акция"
      />
    </div>
    <div class="d-flex align-center mb-4">
      <span class="input-title">Заведение</span>
      <restaurant-selection
        :restaurant="restaurant"
        @restaurantSelected="restaurant = $event"
      />
    </div>
    <div v-if="restaurant" class="restaurant-wrapper">
      <div class="d-flex mb-4 flex-wrap">
        <span class="input-title  mt-3">Изображение акции</span>
        <div class="d-flex flex-column w80">
          <div class="d-flex flex-wrap">
            <v-text-field
              class="mr-3 image-input"
              v-model="image"
              placeholder="{link}"
              outlined
              dense
              hide-details
              required
            />
            <upload-button
              image-type="promotion"
              @image-uploaded="image = $event"
            />
          </div>
          <span class="input-description">
            Скопируйте ссылку на месторасположение изображения акции, либо
            загрузите изображение в формате PNG, SVG
          </span>
        </div>
        <transition name="preview_image">
          <img
            v-if="image"
            class="promotion-image__placeholder preview_image"
            :src="image"
            :key="image"
          />
        </transition>
      </div>

      <div class="d-flex mb-4 flex-wrap">
        <span class="input-title  mt-3">Описание</span>
        <v-textarea
          v-model="promotionDescription"
          class="information-type__description"
          solo
          hide-details
          placeholder="Введите описание акции"
        ></v-textarea>
      </div>

      <div class="d-flex mb-4">
        <span class="input-title mt-3">Тип акции</span>
        <div class="d-flex flex-column">
          <v-chip-group
            v-model="promotionTypeName"
            mandatory
            active-class="type-selected"
            return-object
            class="mb-1"
          >
            <v-chip
              class="justify-center chip-btn"
              v-for="(name, type) in promotionTypes"
              :key="type"
              :value="type"
            >
              <strong class="ma-5">{{ name }}</strong>
            </v-chip>
          </v-chip-group>
          <span class="input-description">
            Выберите тип акции.
          </span>
          <span class="input-description">
            Скидка - тип акции, при котором к блюду / блюдам / всему меню
            заведения будет применен дисконт.
          </span>
          <span class="input-description">
            Информационная - тип акции, которая проинформирует пользователей о
            проходящей активности - конкурсе, розыгрыше призов и т.п.
          </span>
        </div>
      </div>
      <div
        v-if="promotionTypeName === discountPromotion"
        class="sub-input d-flex flex-column mb-4"
      >
        <div class="d-flex mb-2">
          <span class="sub-input-title mt-3 mr-2">Размер скидки</span>
          <v-text-field
            class="discount-type__amount-input "
            v-model="promotionType.amount"
            type="number"
            placeholder="Введите значение"
            outlined
            dense
            hide-details
            required
          />
          <v-chip-group
            v-model="promotionType.discountType"
            active-class="type-selected text--accent-4"
            max="1"
            color="white"
            mandatory
            column
            class="w100px ml-3"
            :value="promotionType.discountType"
          >
            <v-chip
              v-for="(text, type) in discountTypesList"
              :key="text"
              pill
              :value="type"
              class="default-btn circle my-0 discount-chip"
            >
              {{ text }}
            </v-chip>
          </v-chip-group>
        </div>
        <foods-selection
          :restaurantPk="restaurant.pk"
          :key="restaurant.pk"
          :foodIds="promotionType.foodIds"
          @foodsChanged="promotionType.foodIds = $event"
        />
      </div>
      <div class="d-flex mb-4">
        <span class="input-title mt-3">Время действия</span>
        <div class="d-flex flex-column">
          <div class="d-flex align-center mb-3">
            <v-menu
              v-model="startedAtMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="startedAt"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  hide-details
                  required
                  class="calendar-input start-date"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startedAt"
                @input="startedAtMenu = false"
                locale="ru"
              />
            </v-menu>
            <v-icon class="ml-1 calendar-icon">mdi-calendar-month</v-icon>
            <span class="ml-2 mr-2">/</span>
            <v-menu
              v-model="endedAtMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="endedAt"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  hide-details
                  required
                  class="calendar-input end-date"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endedAt"
                @input="endedAtMenu = false"
                locale="ru"
              />
            </v-menu>
            <v-icon class="ml-1 calendar-icon">mdi-calendar-month</v-icon>
          </div>
          <span class="input-description">
            Время действия указывается с 00:00 до 23:59 по умолчанию.
          </span>
        </div>
      </div>
      <div class="d-flex flex-column">
        <v-btn
          class="align-self-center default-btn white--text mb-4 btn-save"
          rounded
          color="#4caf50"
          @click="savePromotion"
        >
          Сохранить акцию
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
  </div>
</template>

<script>
import {
  discountPromotion,
  informationalPromotion,
  promotionTypes,
  serializePromotionType,
  Promotion,
  discountTypes
} from "@/serializers/promotionSerializer";
import moment from "moment";

export default {
  name: "PromotionEdit",
  props: {
    promotion: {
      type: Promotion
    }
  },
  data() {
    return {
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
  },
  created() {
    this.setupDefaults();
  },
  methods: {
    setupDefaults() {
      this.header = this.promotion ? this.promotion.header : "";
      this.image = this.promotion ? this.promotion.image : null;
      this.restaurant = this.promotion ? this.promotion.restaurant : null;
      this.promotionTypeName = this.promotion
        ? this.promotion.typeName
        : informationalPromotion;
      this.promotionDescription = this.promotion
        ? this.promotion.description
        : "";
      this.setupPromotionType();
      this.startedAt =
        this.promotion && this.promotion.startedAt
          ? moment(this.promotion.startedAt).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD");
      this.endedAt =
        this.promotion && this.promotion.endedAt
          ? moment(this.promotion.endedAt).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD");
    },
    setupPromotionType() {
      const defaultTypeName = this.promotion ? this.promotion.typeName : null;
      const type =
        defaultTypeName === this.promotionTypeName
          ? this.promotion.promotionType
          : null;
      this.promotionType = serializePromotionType(this.promotionTypeName, type);
    },
    savePromotion() {
      const editedPromotion = new Promotion();
      editedPromotion.header = this.header;
      editedPromotion.image = this.image;
      editedPromotion.restaurant = this.restaurant;
      editedPromotion.typeName = this.promotionTypeName;
      editedPromotion.promotionType = this.promotionType;
      editedPromotion.startedAt = moment(
        `${this.startedAt} 00:00`,
        "YYYY-MM-DD HH:mm"
      )
        .utc()
        .toISOString(true);
      editedPromotion.endedAt = moment(
        `${this.endedAt} 23:59`,
        "YYYY-MM-DD HH:mm"
      )
        .utc()
        .toISOString(true);
      editedPromotion.description = this.promotionDescription;
      this.$emit("save", editedPromotion);
    }
  },
  watch: {
    promotion() {
      this.setupDefaults();
    },
    promotionTypeName() {
      this.setupPromotionType();
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "src/assets/scss/page.scss";
$title-width: 150px;
.title-view {
  max-width: 50%;
}
.input-title {
  width: $title-width;
}
.sub-input-title {
  @extend .input-title;
  width: auto;
}
.sub-input {
  margin-left: 150px;
}
.type-selected {
  color: white !important;
  background: green;
}
.information-type__description {
  max-width: calc(50% - #{$title-width});
}
.discount-type__amount-input {
  max-width: 200px;
}
.promotion-image__placeholder {
  width: 30em;
  margin: 0.5em 15% !important;
  height: 15em;
  border: 0;
  -o-object-fit: contain;
  object-fit: contain;
}
.calendar-input {
  width: 100px;
}
.calendar-icon {
  color: gray;
}

.w100px {
  width: 100px;
}

.circle {
  height: 35px;
  width: 35px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.preview_image-enter-active,
.preview_image-leave-active {
  transition: all 0.3s;
}

.preview_image-enter,
.preview_image-leave-to {
  filter: blur(5px);
  height: 0;
}
</style>
