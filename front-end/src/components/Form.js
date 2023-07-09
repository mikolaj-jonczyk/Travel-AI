import { FormContainer, SearchButton, SearchForm, SearchInput, Title } from "./container-styles/styles";

function Form(props) {
  return (
    <FormContainer>
      <Title>Travel AI</Title>
      <SearchForm>
        <SearchInput type="text" placeholder="Search for your destination..." />
        <SearchButton type="submit">Search</SearchButton>
        {props.children}
      </SearchForm>
    </FormContainer>
  );
}

export { Form }