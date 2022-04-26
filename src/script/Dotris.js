import BaseComponent from "./components/BaseComponent";
import EventEmitter from "./components/EventEmitter";
import {assets} from "./assets";
import "../style/style.scss";
import {polyfill} from "./utils";

export default class Dotris extends BaseComponent{
    constructor({target}) {
        super(target);
        this.$evnets = new EventEmitter();
        this.$doms = {};


        // console.log("[Dotris]", this);
        polyfill();
        this.init();
    }

    setup() {
        this.$state = {
            currentState: '',

        };
    }

    template() {
        const {
            currentState,
        } = this.$state;
        // console.log("template ", currentState);
        return `
            <canvas class="dotris-board"></canvas>
        `;
    }

    init() {
        this.setEventDelegation();
        this.setEvent();

        this.$doms.board = this.$target.querySelector(".dotris-board");

        console.log("[init]", this);

    }

    setEventDelegation() {
        this.$target.addEventListener("click", (e) => {
            const dataAction = e.target.dataset.action;
            console.log("[click] dataAction: ", dataAction, e.target);
            if (dataAction) {
                this.$evnets.emit(dataAction, e);
            }
        });

    }

    setEvent() {
        this.$evnets.on("play", this.play);

    }

    // render() 호출 후 바로 실행
    update() {

    }

    play = () => {

    }


}
