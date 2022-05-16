import {KEY, ROTATION} from "../constants";

export function polyfill() {
    window.requestAnimationFrame || (window.requestAnimationFrame = (callBack) => {
        setTimeout(callBack, 1000 / 60);
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame = (callBack) => {
        clearTimeout(window.requestAnimationFrame);
    });
}

export function applyStyle(target, styles) {
    for (let value in styles) {
        target.style[value] = styles[value];
    }
}

export function isFunction(functionToCheck) {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export function validateInRange(value, min, max) {
    let validValue;
    if (max && value > max) {
        validValue = max;
    } else if (min && value < min) {
        validValue = min;
    } else {
        validValue = value;
    }
    return validValue;
}

export function timeFormat(time, minutesLength = 1){
    if (time > -1) {
        const t = Number(time),
            hours = Math.floor(t / 60 / 60),
            minutes = Math.floor(t / 60) - (hours * 60 * 60),
            seconds = Math.floor(t) - (hours * 60 * 60) - (minutes * 60);
        return `${hours > 0 ? hours + ':' : ''}${minutesLength === 2 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    } else {
        return "0:00";
    }
}

export const moves = {
    [KEY.DOWN]: (block) => ({...block, y: block.y + 1}),
    [KEY.SPACE]: (block) => ({...block, y: block.y + 1}),
    [KEY.LEFT]: (block) => ({...block, x: block.x - 1}),
    [KEY.RIGHT]: (block) => ({...block, x: block.x + 1}),
    [KEY.UP]: (block) => rotate(block, ROTATION.RIGHT),
    [KEY.Q]: (block) => rotate(block, ROTATION.LEFT),
};

// block 회전 시키기
function rotate(block, direction) {
    // 불변성을 가진 객체 생성
    let $block = JSON.parse(JSON.stringify(block));

    if (!block.hardDropped) {
        // 블록 위치 이동 처리
        for (let y = 0; y < $block.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [$block.shape[x][y], $block.shape[y][x]] = [$block.shape[y][x], $block.shape[x][y]];
            }
        }

        // 정렬 reverse 처리
        if (direction === ROTATION.RIGHT) {
            $block.shape.forEach((row) => row.reverse());
        } else if (direction === ROTATION.LEFT) {
            $block.shape.reverse();
        }
    }
    return $block;
}
