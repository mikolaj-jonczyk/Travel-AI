import { SliderContainer, SliderDiv, SliderInput, SliderRange } from "./container-styles/styles";

function Slider(props) {
  return (
    <SliderDiv>
      <SliderContainer>
        <SliderRange>
          <span>{props.left}</span>
          <span>{props.right}</span>
        </SliderRange>

        <SliderInput type="range" name= {props.slider_value} min="0" max="100" step="25" />
      </SliderContainer>
    </SliderDiv>
  );
}

export { Slider }