import { FormContainer, SearchButton, SearchForm, SearchInput, SliderLabel, Title } from "./container-styles/styles";

import { Attractions } from "./Attrctions";
import { Slider } from './Slider'
import axios from 'axios';
import { useState } from 'react'

const Form = () => {

  const [data, setData] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const be_url = 'http://localhost:8000/chat'
    const formData = new FormData(event.target);
  
    const city = formData.get('city').toString();
    const active_value = parseInt(formData.get('active_value'));
    const group_value = parseInt(formData.get('group_value'));
    const nature_value = parseInt(formData.get('nature_value'));
  
    try {
      const response = await axios.get(be_url, {
        params: {
          city,
          active_value,
          group_value,
          nature_value
        },
      });
      console.log(response);
      console.log(response.data.response.data);
      console.log(response.data[0]);
      setData(Array.from(response.data.response.data));
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormContainer>
      <Title>Travel AI</Title>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput type="text" name="city" placeholder="Search for your destination..." />
        <SearchButton type="submit" >Search</SearchButton>
        <SliderLabel>Select your preferences:</SliderLabel>
        <Slider slider_value="active_value" left="Active" right="Relaxed"></Slider>
        <Slider slider_value="group_value" left="Solo" right="Group"></Slider>
        <Slider slider_value="nature_value" left="Nature" right="Building"></Slider>
      </SearchForm>
      { Object.keys(data).length ? <Attractions data={data}></Attractions> : null }
    </FormContainer>
    //<Attractions data={data}></Attractions>
  );
}

export { Form }