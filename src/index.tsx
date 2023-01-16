/* @jsx h */
import { h, Component, State, Host, Prop, Listen, Watch } from "@stencil/core";
import {state, onChange} from './store'

 @Component({
    tag: 'gigya-store',
    styleUrl: 'index.css',
    shadow: true,
  })
  export class GigyaStore {
    @Prop() apikey: string;
    @Prop() domain: string;
    @State() gigya: {};
    @State() loading: boolean;

    @Listen('onGigyaServiceReady' , { target: 'window' })
    gigyaServiceHandler() {
      console.log('onGigyaServiceReady' );
    }
    getUrl() {
      return `https://cdns.${this.domain}/js/gigya.js?apikey=${this.apikey}`;
    }

    script: HTMLScriptElement;

    
    loadScript() {
      return new Promise((resolve) => {
        console.log("loading script " + this.getUrl());
        this.script = document.createElement('script');
        this.script.src = this.getUrl();
       this.script.async = true;
       this.script.crossOrigin="anonymous" ;

        document.body.appendChild(this.script);
        resolve(this.script);
      });
    }

    gigyaReady() {
      return new Promise((resolve) => {
        onChange('gigya', _ => {
          console.log('loaded ');
          resolve(state.gigya)

        })
      });
    }


    @Watch('apikey')
    watchApiKeyHandler(newValue: string, _: string) {
      document.body.removeChild(this.script);
      state.gigya = undefined;
      console.log('The new value of apikey is: ', newValue);
    }
    @Watch('domain')
    watchDomainHandler(newValue: string, _: string) {
      document.body.removeChild(this.script);
      state.gigya = undefined;
      console.log('The new value of domain is: ', newValue);
    }

    async componentWillLoad() {
      
      if(!state.gigya)
      {
        this.loading = true;
        await this.loadScript();
        this.gigya = await this.gigyaReady();
        this.loading = false;
        console.log("gigya loaded " + this.getUrl());
        console.log(  state.gigya);

      }
    }
 

  render() {
    return (
      <Host>
      <slot ></slot>
       </Host>
    );
  }
}
