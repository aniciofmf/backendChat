const redis = require("redis");

const {
    REDIS_PORT,
    REDIS_HOST
  } = require("../config/config");
  
  const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
  var start = new Date().getTime();
  for (i=0;i<=1000000;i++) {
      let obj = {
          "name": "John "+i,
          "surname": "Smith "+i,
          "age": i,
          "phone": "5555555"
      }

      redisClient.set('clave'+i, JSON.stringify(obj));
  }

  var end = new Date().getTime();
  console.log('cantidad de claves',i);
  console.log(end-start);
  
  /*const obj = {
  "0123456789": "abcdefghij", 
  "some manner of key": "a type of value"
};

redisClient.set('key4', JSON.stringify(obj));
const obj2 =  redisClient.get('key4', function(err,data) {
  console.log(data);
});*/