var clone = require('clone');
var util = require('util');
var m = require('./');

///////////////////////////////////////////
// create two native vectors
var vec1 = new m.Vector(20, 10, 0);
console.log('vec1 ', util.inspect(vec1, { showHidden: true, depth: 4, showProxy: true })); // Vector { x: 20, y: 10, z: 0 }
var vec2 = new m.Vector(20, 10, 0);
console.log('vec2 ', util.inspect(vec2, { showHidden: true, depth: 4, showProxy: true })); // Vector { x: 20, y: 10, z: 0 }

//////////////////////////////////////
// try adding each to the other.
var vecSum = vec1.add(vec2);
console.log('vecSum', vecSum); // Vector { x: 50, y: 10, z: 100 }

var vecSum2 = vec2.add(vec1);
console.log('vecSum2', vecSum2); // Vector { x: 50, y: 10, z: 100 }


///////////////////////////////////////////////////////////////////////////////////////
console.log("\n\nwithout obj._clone:")

var vecclone = clone(vec1);
console.log('vecclone ', util.inspect(vecclone, { showHidden: true, depth: 4, showProxy: true })); // Vector { x: 20, y: 10, z: 0 }


console.log("try add function from clone:")
try{
    var vecSumclone1 = vecclone.add(vec1);
    console.log('vecSumclone1', vecSumclone1); // Vector { x: 50, y: 10, z: 100 }
} catch (e){
    console.log(e);
}

console.log("try adding clone to good vec:")
try{
    var vecSumclone2 = vec1.add(vecclone);
    console.log('vecSumclone2', vecSumclone2); // Vector { x: 50, y: 10, z: 100 }
} catch (e){
    console.log(e);
}



///////////////////////////////////////////////////////////////////////////////////////
console.log("\n\nNow with _clone used:")

// add _clone to Vector prototype
m.Vector.prototype._clone = function(){
    var vec = new m.Vector( this.x, this.y, this.z );
    return vec;
};

var vecclone2 = clone(vec1);
console.log('vecclone2 ', util.inspect(vecclone2, { showHidden: true, depth: 4, showProxy: true })); // Vector { x: 20, y: 10, z: 0 }

console.log("try add function from clone:")
try{
    var vecSumclone3 = vecclone2.add(vec1);
    console.log('vecSumclone1', vecSumclone3); // Vector { x: 50, y: 10, z: 100 }
} catch (e){
    console.log(e);
}

console.log("try adding clone to good vec:")
try{
    var vecSumclone4 = vec1.add(vecclone2);
    console.log('vecSumclone4', vecSumclone4); // Vector { x: 50, y: 10, z: 100 }
} catch (e){
    console.log(e);
}



///////////////////////////////////////////////////////////////////////////////////////
console.log("\n\nNow with _clone used (custom modifier on object, prototype still in place):")

// add ._clone direct to this object only, do something a little different
vec1._clone = function(){
    var vec = new m.Vector( this.x+5, this.y+5, this.z+5 );
    return vec;
};

vecclone2 = clone(vec1);
console.log('vecclone2', util.inspect(vecclone2, { showHidden: true, depth: 4, showProxy: true })); // Vector { x: 20, y: 10, z: 0 }

console.log("try add function from clone:")
try{
    vecSumclone3 = vecclone2.add(vec1);
    console.log('vecSumclone1', vecSumclone3); // Vector { x: 50, y: 10, z: 100 }
} catch (e){
    console.log(e);
}

console.log("try adding clone to good vec:")
try{
    vecSumclone4 = vec1.add(vecclone2);
    console.log('vecSumclone4', vecSumclone4); // Vector { x: 50, y: 10, z: 100 }
} catch (e){
    console.log(e);
}




///////////////////////////////////////////////////////////////////////////////////////
console.log("\n\nNow at depth in a structure:")

// add ._clone direct to this object only, do something a little different
vec1._clone = function(){
    var vec = new m.Vector( this.x+5, this.y+5, this.z+5 );
    return vec;
};

////////////////
// similar to a Node-Red message
var msg = {
    _msgid: 'someuniquebit',
    payload:{
        vec1:vec1, // note still has 'specialist' ._clone
        vec2:vec2, // _clone from prototype will get used
        vecSumclone3:vecSumclone3, // why not try clone of clone?
        more:{
            vec1:vec1, // note still has 'specialist' ._clone
            vec2:vec2 // _clone from prototype will get used
        }
    }
}

console.log('\nmsg ',util.inspect(msg, { showHidden: true, depth: 4, showProxy: true })); // Vector { x: 20, y: 10, z: 0 }
var msgclone = clone(msg);
console.log('\nmsgclone', util.inspect(msgclone, { showHidden: true, depth: 4, showProxy: true })); // Vector { x: 20, y: 10, z: 0 }

console.log("\ntry add functions:")
try{
    var a = msgclone.payload.vecSumclone3.add(msgclone.payload.more.vec2);
    console.log('vecSumclone3+vec2', a); // Vector { x: 50, y: 10, z: 100 }
} catch (e){
    console.log(e);
}



