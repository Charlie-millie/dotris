
import {COLORS, SHAPES} from "../constants";

export default class Block {
    constructor({ctx}) {
        this.$ctx = ctx;

        this.spawn();
    }

    spawn() {
        this.typeId = this.randomizeBlockType(COLORS.length - 1);
        this.shape = SHAPES[this.typeId];
        this.color = COLORS[this.typeId];
        this.x = 0;
        this.y = 0;
        this.hardDropped = false;

        console.log("[block] ", this);
    }

    randomizeBlockType(typeLength) {
        return Math.floor(Math.random() * typeLength + 1);

    }

    hardDrop() {
        this.hardDropped = true;
    }

    draw() {
        this.$ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                 // console.log("[block] value ", value, x, y);
                if (value > 0) {
                    this.$ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });

        });

    }

    setStartPos() {
        this.x = this.typeId === 4 ? 4 : 3;
    }

}