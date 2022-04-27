import {config} from "../config";

export default class Stage {
    constructor({ctx}) {
        this.$ctx = ctx;

        this.init();
    }


    init() {
        this.$ctx.canvas.width = config.COLS * config.BLOCK_SIZE;
        this.$ctx.canvas.height = config.ROWS * config.BLOCK_SIZE;

        this.$ctx.scale(config.BLOCK_SIZE, config.BLOCK_SIZE);

    }


}