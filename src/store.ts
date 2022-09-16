import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
    BoxErrorInterface,
    BoxInterface,
    ColErrorInterface,
    ColorEnum,
    LineErrorInterface,
} from "./interface";

export interface AppState {
    grid: BoxInterface[][];
    selectBox: { i: number; j: number } | null;
    coordSudokuBefore: { i: number; j: number }[];
}

const initialState: AppState = {
    grid: (() => {
        const res: BoxInterface[][] = [];
        for (let i = 0; i < 9; i++) {
            res.push([]);
            for (let j = 0; j < 9; j++) {
                res[i].push({ num: 0, color: ColorEnum.Null });
            }
        }
        return res;
    })(),
    selectBox: null,
    coordSudokuBefore: [],
};

export const appState = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSelectBox(state, action: PayloadAction<{ i: number; j: number }>) {
            state.selectBox = { ...action.payload };
        },
        setNumberSelectedBox(state, action: PayloadAction<number>) {
            if (state.selectBox) {
                state.grid[state.selectBox.i][state.selectBox.j].num =
                    action.payload;
            }
        },
        saveCoordBefore(state) {
            state.coordSudokuBefore = [];
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (state.grid[i][j].num > 0) {
                        state.coordSudokuBefore = [
                            ...state.coordSudokuBefore,
                            { i, j },
                        ];
                    }
                }
            }
        },
        solve(state, action: PayloadAction<number[][]>) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    state.grid[i][j].num = action.payload[i][j];
                    if (
                        state.coordSudokuBefore.some(
                            (it) => it.i === i && it.j === j
                        )
                    ) {
                        state.grid[i][j].color = ColorEnum.DarkGreen;
                    } else {
                        state.grid[i][j].color = ColorEnum.Green;
                    }
                }
            }
        },
        resetGrid(state) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    state.grid[i][j].num = 0;
                    state.grid[i][j].color = ColorEnum.Null;
                }
            }
        },
        update(state) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    state.grid[i][j].color = ColorEnum.Null;
                }
            }

            const lineErrors: LineErrorInterface[] = [];
            for (let i = 0; i < 9; i++) {
                const nums: number[] = [];
                for (let k = 1; k <= 9; k++) {
                    let isInclude = false;
                    for (const v of state.grid[i]) {
                        if (v.num === k) {
                            if (!isInclude) {
                                isInclude = true;
                                continue;
                            }
                            nums.push(k);
                            break;
                        }
                    }
                }
                if (nums.length > 0) {
                    lineErrors.push({ line: i, nums });
                }
            }

            lineErrors.forEach((lineError) => {
                for (let j = 0; j < 9; j++) {
                    if (
                        state.grid[lineError.line][j].color === ColorEnum.Null
                    ) {
                        state.grid[lineError.line][j].color = ColorEnum.Red;
                    }
                    if (
                        lineError.nums.includes(
                            state.grid[lineError.line][j].num
                        )
                    ) {
                        state.grid[lineError.line][j].color = ColorEnum.DarkRed;
                    }
                }
            });

            const colErrors: ColErrorInterface[] = [];
            for (let j = 0; j < 9; j++) {
                const nums: number[] = [];
                const cols = state.grid.map(
                    (cols) => cols.filter((_, i) => i === j)[0]
                );
                for (let k = 1; k <= 9; k++) {
                    let isInclude = false;
                    for (const v of cols) {
                        if (v.num === k) {
                            if (!isInclude) {
                                isInclude = true;
                                continue;
                            }
                            nums.push(k);
                            break;
                        }
                    }
                }
                if (nums.length > 0) {
                    colErrors.push({ col: j, nums });
                }
            }

            colErrors.forEach((colError) => {
                for (let i = 0; i < 9; i++) {
                    if (state.grid[i][colError.col].color === ColorEnum.Null) {
                        state.grid[i][colError.col].color = ColorEnum.Red;
                    }
                    if (
                        colError.nums.includes(state.grid[i][colError.col].num)
                    ) {
                        state.grid[i][colError.col].color = ColorEnum.DarkRed;
                    }
                }
            });

            const boxErrors: BoxErrorInterface[] = [];
            for (let x = 0; x < 9; x++) {
                const nums: number[] = [];
                const boxs: BoxInterface[] = [];
                for (
                    let i = Math.floor(x / 3) * 3;
                    i < (Math.floor(x / 3) + 1) * 3;
                    i++
                ) {
                    for (let j = (x % 3) * 3; j < ((x % 3) + 1) * 3; j++) {
                        boxs.push(state.grid[i][j]);
                    }
                }
                for (let k = 1; k <= 9; k++) {
                    let isInclude = false;

                    for (const v of boxs) {
                        if (v.num === k) {
                            if (!isInclude) {
                                isInclude = true;
                                continue;
                            }
                            nums.push(k);
                            break;
                        }
                    }
                }
                if (nums.length > 0) {
                    boxErrors.push({ box: x, nums });
                }
            }

            boxErrors.forEach((boxError) => {
                for (
                    let i = Math.floor(boxError.box / 3) * 3;
                    i < (Math.floor(boxError.box / 3) + 1) * 3;
                    i++
                ) {
                    for (
                        let j = (boxError.box % 3) * 3;
                        j < ((boxError.box % 3) + 1) * 3;
                        j++
                    ) {
                        if (state.grid[i][j].color === ColorEnum.Null) {
                            state.grid[i][j].color = ColorEnum.Red;
                        }
                        if (boxError.nums.includes(state.grid[i][j].num)) {
                            state.grid[i][j].color = ColorEnum.DarkRed;
                        }
                    }
                }
            });

            if (state.selectBox) {
                state.grid[state.selectBox.i][state.selectBox.j].color =
                    ColorEnum.Blue;
            }
        },
    },
});

export const appAction = appState.actions;

export const store = configureStore({
    reducer: { app: appState.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
