import * as $ from '../dist/bundle';
import res from './assets/assets.json';


new $.App( document.querySelector( '.elemForCanv' ), res ).action();
