export interface Restaurant {
  name: string;
  cuisine: string;
  neighborhood: string;
  price: string;
  rating: number;
  times: string[];
}

const restaurants: Restaurant[] = [
  {
    name: "Trattoria Roma",
    cuisine: "Italian",
    neighborhood: "Downtown",
    price: "$$",
    rating: 4.6,
    times: ["6:00pm", "7:30pm", "9:00pm"],
  },
  {
    name: "Osteria Bella",
    cuisine: "Italian",
    neighborhood: "Midtown",
    price: "$$$",
    rating: 4.8,
    times: ["5:30pm", "7:00pm", "8:30pm"],
  },
  {
    name: "La Piazza",
    cuisine: "Italian",
    neighborhood: "East Side",
    price: "$",
    rating: 4.3,
    times: ["6:00pm", "7:00pm", "9:30pm"],
  },
  {
    name: "Sakura Garden",
    cuisine: "Japanese",
    neighborhood: "Downtown",
    price: "$$$",
    rating: 4.9,
    times: ["5:00pm", "6:30pm", "8:00pm"],
  },
  {
    name: "Ramen House",
    cuisine: "Japanese",
    neighborhood: "Midtown",
    price: "$",
    rating: 4.4,
    times: ["12:00pm", "6:00pm", "7:30pm"],
  },
  {
    name: "Sushi Noko",
    cuisine: "Japanese",
    neighborhood: "East Side",
    price: "$$",
    rating: 4.7,
    times: ["6:00pm", "7:00pm", "8:30pm"],
  },
  {
    name: "Casa Fuego",
    cuisine: "Mexican",
    neighborhood: "Downtown",
    price: "$$",
    rating: 4.5,
    times: ["5:30pm", "7:00pm", "8:30pm"],
  },
  {
    name: "El Rancho",
    cuisine: "Mexican",
    neighborhood: "Midtown",
    price: "$",
    rating: 4.2,
    times: ["6:00pm", "7:30pm", "9:00pm"],
  },
  {
    name: "Taqueria Sol",
    cuisine: "Mexican",
    neighborhood: "East Side",
    price: "$",
    rating: 4.3,
    times: ["5:00pm", "6:30pm", "8:00pm"],
  },
  {
    name: "The Griddle",
    cuisine: "American",
    neighborhood: "Downtown",
    price: "$$",
    rating: 4.4,
    times: ["6:00pm", "7:00pm", "8:00pm"],
  },
  {
    name: "Smokehouse 44",
    cuisine: "American",
    neighborhood: "Midtown",
    price: "$$",
    rating: 4.6,
    times: ["5:30pm", "7:00pm", "9:00pm"],
  },
  {
    name: "Benny's Diner",
    cuisine: "American",
    neighborhood: "East Side",
    price: "$",
    rating: 4.1,
    times: ["6:00pm", "7:30pm", "8:30pm"],
  },
];

export default restaurants;
