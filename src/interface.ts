export enum ColorEnum {
    Null,
    Red,
    DarkRed,
    Blue,
    Green,
    DarkGreen
}

export interface BoxInterface {
    num: number;
    color: ColorEnum;
}

export interface LineErrorInterface {
    line: number;
    nums: number[];
}

export interface ColErrorInterface {
    col: number;
    nums: number[];
}

export interface BoxErrorInterface {
    box: number; // 0 - 8
    nums: number[];
}