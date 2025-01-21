'use client';

import { useState } from "react";
import CoordInput3 from "./CoordInput3";
import CoordInput4 from "./CoordInput4";

export default function CoordInputWrapper({ lv }: { lv: 3 | 4 }) {
    const [[x, y], setCoord] = useState(['0', '0']);
    const [floor, setFloor] = useState(4);

    if (lv === 3) return <CoordInput3 {...{ x, y, setCoord }} />;
    return <CoordInput4 {...{ x, y, setCoord, floor, setFloor }} />;
}
