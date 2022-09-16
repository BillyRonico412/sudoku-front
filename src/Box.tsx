import { useDispatch } from "react-redux";
import { ColorEnum } from "./interface";
import { appAction } from "./store";

type Props = {
    ligne: number;
    col: number;
    num: number;
    color: ColorEnum;
};

const Box = (props: Props) => {
    const dispatch = useDispatch();
    const onClickTd = () => {
        dispatch(appAction.setSelectBox({ i: props.ligne, j: props.col }));
        dispatch(appAction.update());
    };
    return (
        <div
            onClick={onClickTd}
            className={
                "w-8 h-8 border border-gray-400 cursor-crosshair flex justify-center items-center font-black bg-opacity-50 " +
                (() => {
                    switch (props.color) {
                        case ColorEnum.Blue:
                            return "bg-blue-200";
                        case ColorEnum.Green:
                            return "bg-green-200";
                        case ColorEnum.DarkGreen:
                            return "bg-green-400";
                        case ColorEnum.DarkRed:
                            return "bg-red-400";
                        case ColorEnum.Red:
                            return "bg-red-200";
                        case ColorEnum.Null:
                            return "bg-inherit";
                    }
                })()
            }
        >
            {props.num !== 0 && props.num}
        </div>
    );
};

export default Box;
