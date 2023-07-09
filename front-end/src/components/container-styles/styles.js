import styled from "styled-components"

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
`

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
  outline: none;
`

const SearchInput = styled.input`
  padding: 10px;
  border: none;
  border-radius: 4px;
  width: 400px;
  font-size: 16px;
  outline: none;
`

const SliderDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const SliderContainer = styled.div`
  width: 500px;
  margin-top: 20px;
`

const SliderLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px
`
const SliderRange = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  background: #4CAF50;
  outline: none;
  cursor: grab;  
`


const Title = styled.h1`
  font-size: 2rem;

`

export {
  FormContainer, 
  Title, 
  SearchForm, 
  SearchInput, 
  SearchButton, 
  SliderDiv, 
  SliderContainer,
  SliderLabel,
  SliderRange,
  SliderInput
} 