function Attractions(data) {
  return (
    <div>
          {data?.map(single => <div>{single.name}</div>)}
    </div>
  )
}

export { Attractions }