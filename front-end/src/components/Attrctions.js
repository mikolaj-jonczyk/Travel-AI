function Attractions(data) {
  return (
    <div>{data?.repsonse?.data[0]?.name}</div>
  );
}

export { Attractions }