import axios from "axios";
import { useSelector } from "react-redux";
import Box from "./Box";
import ButtonNumber from "./ButtonNumber";
import { appAction, RootState } from "./store";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useDispatch } from "react-redux";
import { FaCheck, FaTrashAlt } from "react-icons/fa";

const App = () => {
    const notyf = new Notyf();
    const dispatch = useDispatch();
    const grid = useSelector((state: RootState) => state.app.grid);
    const onClickSolve = async () => {
        try {
            dispatch(appAction.saveCoordBefore());
            const res = await axios.post(
                import.meta.env.VITE_URL_BACK,
                grid.map((line) => line.map((box) => box.num))
            );
            const sudokuInfo = res.data as number[][];
            dispatch(appAction.solve(sudokuInfo));
        } catch (err) {
            notyf.error("Error solver");
        }
    };
    const onClickDelete = () => {
        dispatch(appAction.resetGrid());
    };
    return (
        <div className="flex justify-center items-center justify-items-center min-h-screen">
            <div className="flex flex-col gap-y-4 items-center">
                <h1 className="font-black text-3xl">Sudoku Solver</h1>
                <div className="flex flex-col border-2 border-gray-400 shadow">
                    {new Array(3).fill(0).map((_, x) => (
                        <div className="flex" key={x}>
                            {new Array(3).fill(0).map((_, y) => (
                                <div
                                    key={y}
                                    className={
                                        "flex flex-col " +
                                        (x % 2 === y % 2 && "bg-gray-200")
                                    }
                                >
                                    {new Array(3).fill(0).map((_, i) => (
                                        <div className="flex" key={i}>
                                            {new Array(3)
                                                .fill(0)
                                                .map((_, j) => (
                                                    <Box
                                                        key={j}
                                                        ligne={x * 3 + i}
                                                        col={y * 3 + j}
                                                        num={
                                                            grid[x * 3 + i][
                                                                y * 3 + j
                                                            ].num
                                                        }
                                                        color={
                                                            grid[x * 3 + i][
                                                                y * 3 + j
                                                            ].color
                                                        }
                                                    ></Box>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="flex gap-x-4">
                        {new Array(5).fill(0).map((_, i) => (
                            <ButtonNumber num={i} key={i} />
                        ))}
                    </div>
                    <div className="flex gap-x-4">
                        {new Array(5).fill(0).map((_, i) => (
                            <ButtonNumber num={5 + i} key={i} />
                        ))}
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <button
                        className="font-black bg-black px-4 py-2  text-white rounded"
                        onClick={onClickSolve}
                    >
                        <FaCheck />
                    </button>
                    <button
                        className="font-black bg-black px-4 py-2  text-white rounded"
                        onClick={onClickDelete}
                    >
                        <FaTrashAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
