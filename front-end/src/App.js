import './App.css';

import { Form } from './components/Form';
import { Slider } from './components/Slider'
import { SliderLabel } from './components/container-styles/styles';

function App() {
  return (
    <div className="App">  
        <Form>
        </Form>
        <SliderLabel>Select your preferences:</SliderLabel>
        <Slider left="Active" right="Relaxed"></Slider>
        <Slider left="Solo" right="Group"></Slider>
        <Slider left="Nature" right="Building"></Slider>
    </div>
  );
}

export default App;
