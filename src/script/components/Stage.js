import {config} from "../config";
import {COLORS, KEY} from "../constants";
import Block from "./Block";
import {moves} from "../utils";


export default class Stage {
    constructor({ctx}) {
        this.$ctx = ctx;
        this.grid = null;
        this.$block = null;


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
        console.log("[Stage]reset grid: ", this.grid);

    }

    draw() {
        this.$block.draw();
        this.renderStage();
    }

    drop() {
        // moves
        const block = moves[KEY.DOWN](this.$block);
        console.log("[drop] block: ", block);




    }

    renderStage() {
        this.grid.forEach((row, y) => {
            // console.log("[stage] row", row, y);
            row.forEach((value, x) => {
                // console.log("[stage] value", value, x, y);
                /*if (value > 0) {
                    this.$ctx.fillStyle = COLORS[value];
                    this.$ctx.fillRect(x, y, 1, 1);
                }*/
            });
        });
    }

    getEmptyGrid() {
        return Array.from({length: config.ROWS}, () => Array(config.COLS).fill(0));

    }


}