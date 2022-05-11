import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";

import "@/datasource/firebase";

import{getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const auth = getAuth(); 
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    oUser : null,
  },
  getters: {
    fnGetUser(state){//사용자객체반환
      return state.oUser;
    }
    ,
    fnGetAuthStatus(state){//사용자 로그인여부판단
      return state.oUser !=null;
    },
  },
  mutations: { //값변경 
    fnSetUser(state,payload){
      state.oUser = payload; //state의 oUser를 payload로 재할당
    },

  },
  actions: {
    fnRegisterUser({commit},payload){//이메일회원저장 회원가입
      createUserWithEmailAndPassword(auth,payload.pEmail,payload.pPassword)
      .then((pUserInfo) => {//성공
        commit("fnSetUser",{//신규회원 스토어에 저장
          email : pUserInfo.user.email
        });
        router.push("/main")
      })
      .catch((err)=>{
        console.log(err.message);//실패 
      });
    },

    DoLogin({commit},payload){//로그인
      signInWithEmailAndPassword(auth,payload.pEmail,payload.pPassword)
      .then((pUserInfo)=>{
        commit('fnSetUser',{//로그인하면 로그인값
          id: pUserInfo.user.uid,
          name:pUserInfo.user.displayName,
          email:pUserInfo.user.email,
          photoURL :pUserInfo.user.photoURL,
        });
        router.push('/main');  
      })
      .catch((err)=>{
        console.log(err.message);
      })
      
    },

     // 파이어베이스 구글 인증
     fnDoGoogleLogin_Popup({ commit }) {
      const oProvider = new GoogleAuthProvider();
      oProvider.addScope("profile");
      oProvider.addScope("email");

      signInWithPopup(auth, oProvider)
        .then((pUserInfo) => {
          commit("fnSetUser", {
            id: pUserInfo.user.uid,
            name: pUserInfo.user.displayName,
            email: pUserInfo.user.email,
            photoURL: pUserInfo.user.photoURL,
          });
          router.push("/main");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
  modules: {},
});
