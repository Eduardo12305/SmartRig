import { Card } from "./css/card.styled";

export function CardPage() {
  // Array de objetos com os dados dos cards
  const cardsData = [
    {
      padding: "75px",
      border: "100px",
      margin: "25px",
      colorh2: "red",
      imgSrc: "path/to/image1.jpg",
      title: "Bro Code",
      text: "tetes"
    },
    {
      padding: "100px",
      border: "185px",
      margin: "15px",
      colorh2: "hsl(257.89915966386553, 97.54098360655739%, 52.156862745098046%)",
      imgSrc: "path/to/image2.jpg",
      title: "Bro Code",
      text: "tetes"
    },
    // Adicione quantos cards quiser
  ];

  return (
    <>
      {cardsData.map((card, index) => (
        <Card
          key={index}  // Usando o índice como chave, mas pode ser outro identificador único
          padding={card.padding}
          border={card.border}
          margin={card.margin}
          colorh2={card.colorh2}
        >
          <img src={card.imgSrc} alt={`Image for ${card.title}`} />
          <h2>{card.title}</h2>
          <p>{card.text}</p>
        </Card>
      ))}
    </>
  );
}
