import {createStore} from "@stencil/store";

interface Gigya {
  socialize: any,
  accounts: any,
  gigya: any,
  loaded: boolean,
  // screenSet: ScreenSetController
}




const {state, onChange} = createStore<Gigya>({
  accounts: {},
  socialize: {},
  gigya: undefined,
  loaded: window.gigya !== typeof undefined,
  // screenSet: new ScreenSetController()
});

onChange('gigya', value => {
  state.socialize = value.socialize;
  state.accounts = value.accounts;
})

function loadGigyaService() {
  state.gigya = window.gigya;
  console.log("on gigya load")
}


declare global {

  interface Window {
    gigya: any,
    onGigyaServiceReady: any

  }


}

if (window.gigya) {
  loadGigyaService();
}
window.onGigyaServiceReady = loadGigyaService;

export {state, onChange};
