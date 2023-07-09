import './App.css';

import { Form } from './components/Form';
import { Slider } from './components/Slider'
import { SliderLabel } from './components/container-styles/styles';
import axios from 'axios';

function App() {
  return (
    <div className="App">  
        <Form onSubmit={handleSubmit}>
        </Form>
        <SliderLabel>Select your preferences:</SliderLabel>
        <Slider left="Active" right="Relaxed"></Slider>
        <Slider left="Solo" right="Group"></Slider>
        <Slider left="Nature" right="Building"></Slider>
    </div>
  );
}

const handleSubmit = async (event) => {
  event.preventDefault();

  // Get the form data
  const formData = new FormData(event.target);
  const city = formData.get('city');
  const email = formData.get('email');

  // Send the POST request
  try {
    const response = await axios.get('http://localhost:8000', {
      params: {
        city,
        email,
      },
    });
    console.log(response.data); // Handle the response
  } catch (error) {
    console.error(error);
  }
};

export default App;
