import { createRef } from "react";

export default function createRefList(len, currentRef) {
    if (len === 0) return;
    else {
        currentRef = Array(len).fill().map((_, i) => {
            currentRef[i] || createRef();
        });
    }
}