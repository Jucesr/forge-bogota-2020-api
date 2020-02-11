const getFactor = (measure) => {
   // Get the distance => C.
   let parseDistance = parseFloat(measure.distance.substring(0, measure.distance.length - 2))
   
   // Get A and B distance
   const point1 = measure.picks[0].intersection
   const point2 = measure.picks[1].intersection

   const a = Math.abs(point1.x - point2.x);
   const b = Math.abs(point2.y - point1.y);

   const c = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
   const factor = parseDistance / c;
   return factor;
}

const convertMeasure = (measure, factor) => {
   return {
      ...measure,
      picks: measure.picks.map(pick => ({
         ...pick,
         intersection: {
            x: pick.intersection.x*factor,
            y: pick.intersection.y*factor,
            z: pick.intersection.z*factor
         }
      }))
   }
}

const convertObjToDesignAutomationFormat = (arrayOfMeasurementWalls, factor) => {
   return arrayOfMeasurementWalls.reduce((acum, item) => {
      const measurementList = item.measurementList.map(measure => {

         const mi = convertMeasure(measure, factor);
         return {
            start: {
               ...mi.picks[0].intersection
            },
            end: {
               ...mi.picks[1].intersection
            },
            type: "Basic Wall",
            material: item.family.material,
            thickness: parseFloat(item.family.thicknes)
         }
      })

      return [
         ...acum,
         ...measurementList
      ]
   }, [])
}

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

// const objectToString = (obj) => Object.keys(obj).reduce((acum, key, index) => {
//    const value = obj[key]
//    return `${acum} '${key}': ${typeof value == 'string' ? `'${value}'` : value} ${index == Object.keys(obj).length - 1 ? '' : ','} `
// }, '') 

const replaceAll = (text, search, replacement) => {
   text = text.replace(new RegExp(search, 'g'), replacement);
   return text;
};



const objectToString = (obj) => {
   let json = JSON.stringify(obj);
   return replaceAll(json, "\"", "'")
}

module.exports = {
   getFactor,
   convertMeasure,
   convertObjToDesignAutomationFormat,
   sleep,
   objectToString,
   replaceAll
}