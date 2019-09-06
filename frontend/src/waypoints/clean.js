// const csvFilePath = "<./shape.txt>";
const csv = require("csvtojson");
const fs = require("fs");
const testData = __dirname + "/shape.txt";
const Converter = require("csvtojson").Converter;
// const converter = csv({
//   noheader: false,
//   trim: true
// });

const newObj = {};
const results = [
  { shape: "01_shp", waypoints: [] },
  {
    shape: "02_shp",
    waypoints: []
  },
  {
    shape: "03_shp",
    waypoints: []
  },
  {
    shape: "04_shp",
    waypoints: []
  },
  {
    shape: "05_shp",
    waypoints: []
  },
  {
    shape: "06_shp",
    waypoints: []
  },
  {
    shape: "07_shp",
    waypoints: []
  },
  {
    shape: "08_shp",
    waypoints: []
  },
  {
    shape: "09_shp",
    waypoints: []
  },
  {
    shape: "10_shp",
    waypoints: []
  },
  {
    shape: "11_shp",
    waypoints: []
  },
  {
    shape: "12_shp",
    waypoints: []
  }
];
csv()
  .fromFile("./shape.txt")
  .subscribe(jsonObj => {
    results.forEach(ele => {
      if (ele.shape === jsonObj.shape_id) {
        ele.waypoints.push([jsonObj.shape_pt_lat, jsonObj.shape_pt_lon]);
      }
    });
  })
  .on("done", () => {
    fs.writeFile(
      "./all_shapes.json",
      JSON.stringify(results, null, 4),
      "utf8",
      function(err) {
        if (err) {
          console.log(err);
        } else {
          //Everything went OK!
          console.log("File has been created");
        }
      }
    );
  });

console.log(results);

// var Converter = require("csvtojson").Converter;
// // var columArrData = __dirname + "/shape.txt";
// // var rs = fs.createReadStream(columArrData);
// var result = {};
// var csvConverter = new Converter();
// //end_parsed will be emitted once parsing finished
// csvConverter.on("end_parsed", function(jsonArray) {
//   console.log(jsonArray); //here is your result jsonarray
// });
// // csvConverter.on("record_parsed", function (wayPointRow, rawRow, rowIndex) {

// //   for (var key in wayPointRow) {
// //     if (!result[key] || !result[key] instanceof Array) {
// //       result[key] = [];
// //     }
// //     result[key][rowIndex] = resultRow[key];
// //   }

// // });
// require("fs")
//   .createReadStream("./shape.txt")
//   .pipe(csvConverter);

// fs.writeFile(
//   "./all_shapes.json",
//   JSON.stringify(jsonObj, null, 4),
//   "utf8",
//   function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       //Everything went OK!
//       console.log("File has been created");
//     }
//   }
// );

// csv()
//   .fromFile("./shape.txt")
//   .subscribe(jsonObj => {
//     results.push("s");
//   })
//   .on("header", header => {
//     // console.log(header);
//     //header=> [header1, header2, header3]
//   });

// csvToJSON();

// get csv file and create stream

// const csvConverter = new Converter({});
// csvConverter.fromFile("./shape.txt", function(err, result) {
//   console.log(result);
// });
// var data = fs.readFileSync(testData).toString();
// console.log(data);

//end_parsed will be emitted once parsing finished
// csvConverter.on("end_parsed", function(jsonObj) {
//   console.log(jsonObj); //here is your result json object
// });

// //record_parsed will be emitted each time a row has been parsed.
// csvConverter.on("record_parsed", function(resultRow, rawRow, rowIndex) {
//   console.log(resultRow); //here is your result json object
// });

// const readStream = require("fs").createReadStream("./shape.txt");
// // convert csv file (stream) to JSON format data
// const newjson = csv().fromStream(readStream);
// console.log(newjson);

// csvConverter.fromString(data, function(err, jsonObj) {
//   // if (err) {
//   //   // err handle
//   // }
//   console.log(data);
// });

// const writeStream = require("fs").createWriteStream("./converted.json");

// newjson.pipe(csvConverter).pipe(writeStream);

// csv()
//   .fromString(data)
//   .subscribe(function(json) {
//     console.log(json);
//   });

// console.log(readStream);

// console.log(results);
// .then(jsonObj => {
//   console.log(jsonObj);
// });

// fs.writeFile(
//   "./test.json",
//   JSON.stringify(jsonObj, null, 4),
//   "utf8",
//   function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       //Everything went OK!
//       console.log("File has been created");
//     }
//   }
// );

// .subscribe((jsonObj, index) => {
//   // console.log(jsonObj);
//   // // OR asynchronously
//   // return new Promise((resolve, reject) => {
//   //   jsonObj.myNewKey = "some value";
//   //   resolve();
//   // });
// })
// .preRawData(jsonrowObj => {
//   // console.log(jsonObj.toString("utf8"));

//   // let abc = JSON.parse(jsonObj.toString("utf8"));

//   results.push(jsonrowObj);
//   // return results; // some value
//   console.log(results);
// });
// .on("end", error => {
//   // console.log(results);
//   results.push("aja");
// });
