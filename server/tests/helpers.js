'use strict';
const Datauri = require('datauri');

class fixtures{

   static signature(name='sig1'){
     return Datauri(`app/spec/files/images/signatures/${name}.png`);
   }

  static headshot(name='hs1'){
    return Datauri(`app/spec/files/images/headshots/${name}.jpg`);
  }

  static splashImage(name='buildon'){
    return Datauri(`app/spec/files/images/splash_images/${name}.jpg`);
  }

  static logo(name='buildon'){
    return Datauri(`app/spec/files/images/logos/${name}.jpg`);
  }
}



// we mock various mothods for testing
var mocks = {

  user: class User {
    static capturePayment(){

    }
  }

}

module.exports = {fixtures: fixtures, mocks: mocks}
