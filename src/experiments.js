fs = require("fs");

var base_list_raw = fs.readFileSync("bases.json", "utf-8");
base_list = JSON.parse(base_list_raw);
console.log(base_list);