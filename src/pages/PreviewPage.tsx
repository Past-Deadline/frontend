import { useState } from "react";
import PreviewMap from "../components/PreviewMap"
import VerticalDoubleRange from "../components/RangeSlider"
import Slider from "../components/Slider"

export const PreviewPage = () => {
    const [rangeValues, setRangeValues] = useState<[number, number]>([20, 80]);
    return (
        <PreviewMap>
            <Slider />
            <VerticalDoubleRange
                min={0}
                max={100}
                initialValues={rangeValues}
                height={400}
                onChange={(vals) => setRangeValues(vals)}
            />
        </PreviewMap>

    )
}