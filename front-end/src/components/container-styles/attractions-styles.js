import styled from "styled-components"

const AttractionsItem = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px; 
  background-color: #f2f2f2;
  border-style: solid;
  border-width: 2px;
  border-radius: 15px;
  border-color: #3C372C;
  margin: 5px;
  color: #3C372C;
  `

 const AttractionsContainer = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #EFEDE3;
  max-width: 530px;
  `

  const AttractionsName = styled.h1`
  font-size: 1.3rem;
  margin: 1.5rem;
  text-decoration: underline;
  `

  const AttractionsDescription = styled.div`
  grid-area: 2 / 1 / 3 / 3;
  font-size: 1rem;
  margin-bottom: 0.1rem;
  margin: 0.7rem;
  `

  const AttractionsNameLocation = styled.div`
  grid-area: 1 / 2 / 2 / 3;
  font-size: 1.6rem;
  margin: 0.1rem;
`
  
const AttractionsImage = styled.div`
  grid-area: 1 / 1 / 2 / 2;
  margin: 0.2rem;
  `

  const AttractionsLocationText = styled.h4`
  margin: 0.8rem;
  font-size: 1rem;
  `

const Image = styled.img`
  width:100%;
  height:100%;
  max-width:300px;
  max-height: 200px;
  border: 2px solid;
  border-radius: 15px;
  border-color: #f2f2f2;
`


  export {
    AttractionsItem,
    AttractionsContainer,
    AttractionsName,
    AttractionsLocationText,
    AttractionsDescription,
    AttractionsImage,
    AttractionsNameLocation,
    Image
  } 