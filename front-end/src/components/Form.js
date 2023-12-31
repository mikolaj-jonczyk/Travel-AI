import {
  AttractionsContainer,
  AttractionsDescription,
  AttractionsImage,
  AttractionsItem,
  AttractionsLocationText,
  AttractionsName,
  AttractionsNameLocation,
  Image
} from './container-styles/attractions-styles'
import { FormContainer, SearchButton, SearchForm, SearchInput, SliderLabel, Title } from "./container-styles/styles";

import { RingLoader } from 'react-spinners'; // Import the RingLoader component from react-spinners
import { Slider } from './Slider'
import axios from 'axios';
import { useState } from 'react';

const Form = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const be_url = 'http://localhost:8000';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const city = formData.get('city').toString();
    const active_value = parseInt(formData.get('active_value'));
    const group_value = parseInt(formData.get('group_value'));
    const nature_value = parseInt(formData.get('nature_value'));

    try {
      setLoading(true);
      const response = await axios.get(be_url + "/places", {
        params: {
          city,
          active_value,
          group_value,
          nature_value
        },
      });
      console.log(response.data.data);
      setData(response.data.data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Travel AI</Title>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput type="text" name="city" placeholder="Search for your destination..." />
        <SearchButton type="submit" disabled={loading}>
          {loading ? (
            <RingLoader color="#ffffff" loading={loading} size={30} /> // Use the RingLoader component from react-spinners
          ) : (
            'Search'
          )}
        </SearchButton>
        <SliderLabel>Select your preferences! Based on them we will show you different attractions to visit!</SliderLabel>
        <Slider slider_value="active_value" left="Active" right="Relaxed" />
        <Slider slider_value="group_value" left="Solo" right="Group" />
        <Slider slider_value="nature_value" left="Nature" right="Urban" />
      </SearchForm>
      <AttractionsContainer>
      { data.length > 0 ? 
       data?.map(single =>
         <AttractionsItem>
            <AttractionsImage><Image src={be_url + "/image/?file_name=" + single.photo}></Image></AttractionsImage>
            <AttractionsNameLocation>
              <AttractionsName>{single.name}</AttractionsName>
              <AttractionsLocationText>Location: {single.location}</AttractionsLocationText>
            </AttractionsNameLocation>
            <AttractionsDescription>
              <h3>Description:</h3>
              {single.description}
            </AttractionsDescription>
            
          </AttractionsItem>)
        : null }
      </AttractionsContainer>
    </FormContainer>
  );
};

export { Form };