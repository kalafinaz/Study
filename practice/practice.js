let obj1 = { name: "Tom", arr1: [1, [2,3], 4]};
let obj3 = deepClone(obj1);
obj3.name = "Spike";
obj3.arr1[1] = [5,6];
console.log(obj1);
console.log(obj3);