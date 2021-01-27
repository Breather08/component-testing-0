// const moment = (validDateString) => {
//   let date = validDateString ? new Date(validDateString) : new Date();

//   date = String(date.toISOString());

//   date.__proto__.utc = () => {
//     return date;
//   };

//   date.__proto__.format = (formatString) => {
//     if (formatString === "YYYY-MM-DD") return date.split("T")[0];
//     return new Error("unknown format");
//   };

//   date.__proto__.toISOString = (flag) => {
//     if (flag) {
//       return date.replace(
//         /Z/,
//         `+0${String((-1 * new Date(date).getTimezoneOffset()) / 60)}:00`
//       );
//     }
//     return date;
//   };

//   return date;
// };

const toISOString = jest.fn(() => {});

const format = jest.fn(() => new Date().toISOString().split("T")[0]);

const utc = jest.fn(() => {
  let date = new Date();

  date.__proto__.toISOString = toISOString;
  date.__proto__.format = format;

  return {};
});

export default {
  //   moment: jest(moment)
  utc,
  toISOString,
  format
};
