import { ReactElement } from "react";

interface ButtonProps {
    title : string;
    size : "lg" | "md" | "sm";
    color : "primary" | "secondary" | "danger" | "success";
    startIcon? : ReactElement;
    endIcon? : ReactElement;
    onClick? : () => void;
    disabled? : boolean;
}

const sizeStyles = {
    "lg" : "px-8 py-4 text-xl rounded-xl",
    "md" : "px-6 py-3 text-lg rounded-lg",
    "sm" : "px-4 py-2 text-base rounded-md",
}

const colorStyles = {
    "primary" : "bg-purple-500 text-white hover:bg-purple-600", 
    "secondary" : "bg-purple-400 text-white hover:bg-purple-500",
    "danger" : "bg-red-500 text-white hover:bg-red-600",
    "success" : "bg-green-500 text-white hover:bg-green-600",
}

export function Button(props: ButtonProps) {

    return <button className={sizeStyles[props.size] + " " + colorStyles[props.color]}>
        <div className="flex items-center">
            {props.startIcon}
            <div className="pl-2 pr-2">
                {props.title}
            </div>
            {props.endIcon}
        </div>
    </button>
}