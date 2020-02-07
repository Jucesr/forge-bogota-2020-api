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
   objectToString
}


// const data = {
//    "walls": [
//      {
//        "start": {
//          "x": 45.85588489684545,
//          "y": 107.20760647231336,
//          "z": 0
//        },
//        "end": {
//          "x": 64.11983361789842,
//          "y": 107.25088596800931,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Concrete Precast",
//        "thickness": 0.2
//      },
//      {
//        "start": {
//          "x": 72.94885148305198,
//          "y": 116.16646208137365,
//          "z": 0
//        },
//        "end": {
//          "x": 63.94671562054246,
//          "y": 107.20760647231336,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Concrete Precast",
//        "thickness": 0.2
//      },
//      {
//        "start": {
//          "x": 73.03666734704774,
//          "y": 136.18119976106024,
//          "z": 0
//        },
//        "end": {
//          "x": 73.09170336205419,
//          "y": 116.20312545213699,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Concrete Precast",
//        "thickness": 0.2
//      },
//      {
//        "start": {
//          "x": 45.84887593386459,
//          "y": 118.7898182689948,
//          "z": 0
//        },
//        "end": {
//          "x": 62.414716450804114,
//          "y": 118.89989030375472,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "CMU",
//        "thickness": 0.3
//      },
//      {
//        "start": {
//          "x": 70.94529877680289,
//          "y": 127.43047299764757,
//          "z": 0
//        },
//        "end": {
//          "x": 62.414716450804114,
//          "y": 118.84485428637474,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "CMU",
//        "thickness": 0.3
//      },
//      {
//        "start": {
//          "x": 70.94529877680289,
//          "y": 136.01609170892038,
//          "z": 0
//        },
//        "end": {
//          "x": 70.78019073178355,
//          "y": 127.43046722904269,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "CMU",
//        "thickness": 0.3
//      },
//      {
//        "start": {
//          "x": 45.79383991885815,
//          "y": 127.10025112476295,
//          "z": 0
//        },
//        "end": {
//          "x": 65.49673329116496,
//          "y": 127.10025112476295,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Brick",
//        "thickness": 0.1
//      },
//      {
//        "start": {
//          "x": 69.62443441664824,
//          "y": 131.28298844563946,
//          "z": 0
//        },
//        "end": {
//          "x": 65.38666126115208,
//          "y": 127.21032315952287,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Brick",
//        "thickness": 0.1
//      },
//      {
//        "start": {
//          "x": 69.29421832660958,
//          "y": 136.29126602721527,
//          "z": 0
//        },
//        "end": {
//          "x": 69.29421832660958,
//          "y": 130.95277234135975,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Brick",
//        "thickness": 0.1
//      },
//      {
//        "start": {
//          "x": 65.60100363436891,
//          "y": 146.02612084434904,
//          "z": 0
//        },
//        "end": {
//          "x": 94.89608650951152,
//          "y": 146.16474110547512,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Metal",
//        "thickness": 0.1
//      },
//      {
//        "start": {
//          "x": 95.03470677548223,
//          "y": 136.09166879698014,
//          "z": 0
//        },
//        "end": {
//          "x": 94.89608650951152,
//          "y": 146.2571546128925,
//          "z": 0
//        },
//        "type": "Basic Wall",
//        "material": "Metal",
//        "thickness": 0.1
//      }
//    ],
//    "floors": []
//  }

// console.log(objectToString(data)) 