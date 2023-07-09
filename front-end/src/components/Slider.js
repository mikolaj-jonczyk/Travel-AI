import { SliderContainer, SliderDiv, SliderInput, SliderRange } from "./container-styles/styles";

function Slider(props) {
  return (
    <SliderDiv>
      <SliderContainer>
        <SliderRange>
          <span>{props.left}</span>
          <span>{props.right}</span>
        </SliderRange>

        <SliderInput type="range" id="travel-type" name="travel-type" min="0" max="1" step="0.25" />
      </SliderContainer>
    </SliderDiv>
  );
}

export { Slider }