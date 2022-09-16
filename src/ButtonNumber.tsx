import { useDispatch } from "react-redux";
import { appAction } from "./store";

type Props = {
    num: number;
};

const ButtonNumber = (props: Props) => {
    const dispatch = useDispatch();
    return (
        <button
            className="bg-black rounded text-lg text-white font-black w-8 h-8 flex justify-center items-center shadow"
            onClick={() => {
                dispatch(appAction.setNumberSelectedBox(props.num));
                dispatch(appAction.update());
            }}
        >
            {props.num}
        </button>
    );
};

export default ButtonNumber;
