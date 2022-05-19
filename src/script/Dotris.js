import BaseComponent from "./components/BaseComponent";
import EventEmitter from "./components/EventEmitter";
import {assets} from "./assets";
import {moves, polyfill} from "./utils";
import Stage from "./components/Stage";
import {KEY, LEVEL} from "./constants";
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
        this.$ctxNext = null;
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
                <canvas class="dotris-next" width="${config.nextCOLS * config.BLOCK_SIZE}" height="${config.nextROWS * config.BLOCK_SIZE}"></canvas>
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
        this.$doms.nextBlock = this.$target.querySelector(".dotris-next");
        this.$ctxNext = this.$doms.nextBlock.getContext("2d");
        this.$ctxNext.scale(config.BLOCK_SIZE, config.BLOCK_SIZE);

        this.$stage = new Stage({
            ctx: this.$ctx,
            ctxNext: this.$ctxNext
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

    keyPressHandler = (event) => {
        switch (event.keyCode) {
            case KEY.P:
                this.pause();
                break;
            case KEY.ESC:
                this.gameOver();
                break;
            default:
                this.processBlock(event);
                break;
        }

    }

    processBlock(event) {
        if (moves[event.keyCode]) {
            event.preventDefault();
            // 이동 적용된 블럭 정보 가져옴
            let block = moves[event.keyCode](this.$stage.$block);

            if (event.keyCode === KEY.SPACE) {
                // hard drop 처리
                while(this.$stage.validation(block)) {
                    //todo score count & play sound
                    this.$stage.$block.move(block);
                    block = moves[KEY.DOWN](this.$stage.$block);

                }
                this.$stage.$block.hardDrop();
            } else if (this.$stage.validation(block)) {
                this.$stage.$block.move(block);
                if (event.keyCode === KEY.DOWN) {
                    //todo score count & play sound
                }
            }

        }
    }

    setEvent() {
        this.$evnets.on("play", this._playHandler);


        // document.removeEventListener("keydown", this.keyPressHandler);
        document.addEventListener("keydown", this.keyPressHandler);

    }

    // render() 호출 후 바로 실행
    update() {

    }

    animate = (now = 0) => {
        this.time.elapsed = now - this.time.start;
        if (this.time.elapsed > this.time.level) {
            this.time.start = now;
            if (!this.$stage.drop()) {
                this.gameOver();
                return;
            }
        }
        // console.log("[animate] ");
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

    gameOver() {
        console.log("==========GAMEOVER================");
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
