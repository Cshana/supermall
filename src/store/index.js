import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const store = new vuex.Store({
    state: {
        cartList: []
    },
    getters:{
        cartLength(state){
            return state.cartList.length
        },
        cartList(state){
            return state.cartList
        }
    },
    mutations: {
        addCart(state,payload){
            payload.check = true
            let oldproduct =null;
            for(let item of state.cartList){ 
                if(item.iid === payload.iid){
                    oldproduct = item
                }
            }
            if(oldproduct){
                oldproduct.count +=1
            }else{
                payload.count = 1
                state.cartList.push(payload)
            }
        },
    }
})

export default store