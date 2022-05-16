import {config} from "../config";
import {COLORS, KEY} from "../constants";
import Block from "./Block";
import {moves} from "../utils";


export default class Stage {
    constructor({ctx, ctxNext}) {
        this.$ctx = ctx;
        this.$ctxNext = ctxNext;
        this.grid = null;
        this.$block = null;

        // next block
        this.$blockNext = null;

        this.init();
    }


    init() {
        // 블럭 스케일 일괄 적용을 위한
        this.$ctx.scale(config.BLOCK_SIZE, config.BLOCK_SIZE);

    }

    reset() {
        this.grid = this.getEmptyGrid();
        this.$block = new Block({
            ctx: this.$ctx
        });
        this.$block.setStartPos();
        console.log("[Stage] reset grid: ", this.grid);

    }

    draw() {
        console.log("[Stage] draw");
        this.$block.draw();
        this.renderStage();
    }

    drop() {
        // moves
        const block = moves[KEY.DOWN](this.$block);
        console.log("[drop] block: ", block);
        console.log("[drop] == ", this.validation(block));
        
        // 이동 가능 상태인지 체크
        if (this.validation(block)) {
            this.$block.move(block);
        } else {
            this.appendBlock();
            this.removeLines();

            this.initNextBlock();
        }

        return true;
    }

    renderStage() {
        this.grid.forEach((row, y) => {
            // console.log("[stage] row", row, y);
            row.forEach((value, x) => {
                // console.log("[stage] value", value, x, y);
                if (value > 0) {
                    this.$ctx.fillStyle = COLORS[value];
                    this.$ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    getEmptyGrid() {
        return Array.from({length: config.ROWS}, () => Array(config.COLS).fill(0));

    }

    validation(block) {
        return block.shape.every((row, dy) => {
            console.log("[validation] row", row, dy, block);
            return row.every((value, dx) => {
                console.log("[validation] value", value, dx);
                let x = block.x + dx;
                let y = block.y + dy;
                console.log(x, y);
                return value === 0 || (this.boundingWallCheck(x, y) && this.existBlockCheck(x, y));

            });

        });
    }

    boundingWallCheck(x, y) {
        // block이 stage 안에 있는지 체크
        return x >= 0 && x < config.COLS && y <= config.ROWS;
    }

    existBlockCheck(x, y) {
        // block이 해당 그리드에 있는지 체크
        // console.log("[grid] ---> ", this.grid[y], this.grid[y][x]);
        return this.grid[y] && this.grid[y][x] === 0;
    }

    appendBlock() {
        // stage grid에 해당 block append 처리 (stage grid에 block shape value 치환)
        this.$block.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                 if (value > 0) {
                     this.grid[y + this.$block.y][x + this.$block.x] = value;
                 }
            });
        });
    }

    initNextBlock() {
        this.createNextBlock();
        this.$block = this.$blockNext;
        this.$block.$ctx = this.$ctx;
        this.$block.setStartPos();

    }

    createNextBlock() {
        const {
            width,
            height
        } = this.$ctxNext.canvas;
        this.$blockNext = new Block({
            ctx: this.$ctxNext
        });
        this.$ctxNext.clearRect(0, 0, width, height);
        this.$blockNext.draw();
    }

    removeLines() {
        // 꽉찬 라인 지워주기
        let line = 0;
        this.grid.forEach((row, y) => {
            if (row.every((value) => value > 0)) {
                line++;
                // 라인 지우기
                this.grid.splice(y, 1);
                // 최상단에 빈 라인 추가
                this.grid.unshift(Array(config.COLS).fill(0));

            }
        });

        // score 계산
        if (line > 0) {

        }

    }





}