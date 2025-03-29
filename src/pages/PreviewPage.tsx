import PreviewMap from "../components/PreviewMap"
import RangeSlider from "../components/RangeSlider"
import Slider from "../components/Slider"

export const PreviewPage = () => {

    return(
        <PreviewMap props="">
            <Slider />
            <RangeSlider min={0} max={0} />
        </PreviewMap>
    )
}