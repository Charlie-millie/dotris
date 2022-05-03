import BaseComponent from "./components/BaseComponent";
import EventEmitter from "./components/EventEmitter";
import {assets} from "./assets";
import {polyfill} from "./utils";
import Stage from "./components/Stage";
import {LEVEL} from "./constants";
import {config} from "./config";
import "../style/style.scss";
import DungGeunMo from "../assets/font/DungGeunMo.woff2";

polyfill();
export default class Dotris extends BaseComponent{
    constructor({target}) {
        super(target);

        this.$evnets = new EventEmitter();
        this.$doms = {};
        this.$ctx = null;
        this.$stage = null;

        this.animateId = null;
        this.time = null;
        this.isFirstPlay = false;



        this.init();
    }

    setup() {
        this.$state = {
            currentState: 'play', // [play, pause]
            score: 0,
            level: 0,
            lines: 0,
        };
    }

    template() {
        const {
            currentState,
        } = this.$state;
        // console.log("template ", currentState);
        return `
            <canvas class="dotris-stage" width="${config.COLS * config.BLOCK_SIZE}" height="${config.ROWS * config.BLOCK_SIZE}"></canvas>
            <div class="dotris-info">
                
                <button class="dotris-play-button" data-action="play">${currentState.toUpperCase()}</button>
            </div>
          
        `;
    }

    init() {
        this.setEventDelegation();
        this.setEvent();

        this.loadFonts('DungGeunMo', DungGeunMo);

        this.$doms.stage = this.$target.querySelector(".dotris-stage");
        this.$ctx = this.$doms.stage.getContext("2d");

        this.$stage = new Stage({
            ctx: this.$ctx
        });

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

    _keyPressHandler(event) {

    }

    setEvent() {
        this.$evnets.on("play", this._playHandler);


        // document.removeEventListener("keydown", this._keyPressHandler);
        document.addEventListener("keydown", this._keyPressHandler);

    }

    // render() 호출 후 바로 실행
    update() {

    }

    animate = (now = 0) => {

        this.time.elapsed = now - this.time.start;
        console.log("[animate] ");
        // clear stage
        this.$ctx.clearRect(0, 0, this.$ctx.canvas.width, this.$ctx.canvas.height);
        this.$stage.draw();
        this.animateId = window.requestAnimationFrame(this.animate);
    }

    _playHandler = (e) => {
        const {
            currentState,
        } = this.$state;
        switch (currentState) {
            case "pause":
                this.pause();
                break;
            case "play":
                this.play();
                break;
        }
    }

    play = (e) => {
        // console.log("[play] ", e);

        if (!this.isFirstPlay) {
            this.reset();
            this.isFirstPlay = true;
        }
        this.setState({
            currentState: "pause"
        });
        // 이미 실행중이면 캔슬처리
        if (this.animateId) {
            window.cancelAnimationFrame(this.animateId);
        }
        this.animate();

    }

    pause = () => {
        this.setState({
            currentState: "play"
        });
        window.cancelAnimationFrame(this.animateId);
        this.animateId = null;

        this.$ctx.fillStyle = '#333';
        this.$ctx.fillRect(0, 3, 10, 1.2);
        this.$ctx.font = '1.5px DungGeunMo';
        this.$ctx.fillStyle = '#fff';
        this.$ctx.fillText('PAUSED', 3, 4);
    }

    reset() {
        this.setState({
            currentState: "play",
            score: 0,
            level: 0,
            lines: 0,
        });
        this.$stage.reset();

        this.time = {
            start: performance.now(),
            elapsed: 0,
            level: LEVEL[this.$state.level]
        };
        console.log("--time", this.time);
    }

    async loadFonts(name, url) {
        const font = new FontFace(name, `url(${url})`);
        await font.load();
        document.fonts.add(font);
    }

}
