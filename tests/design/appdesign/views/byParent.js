

    function map (doc){
        const myfuncts = function(){
            emit(doc._id,1);
        }
        if(doc.parent){
            myfuncts();
        }else{
            emit('helo',1);
        }
    }

    function reduce(keys,values,rereduce){
        if(doc.parent){
            
        }
    }

module.exports = { map, reduce }