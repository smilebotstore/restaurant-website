export const restaurant = {
  name: "Nasi Goreng Jaya Bintang",
  shortName: "Jaya Bintang",
  tagline: "Nasi Goreng dan Mie Goreng, Solusi Untuk Lapar Mu",
  address:
    "Jl. Sultan Agung, Krajan, Rowo Tengah, Kec. Sumberbaru, Kabupaten Jember, Jawa Timur 68156, Indonesia",
  mapsUrl: "https://maps.app.goo.gl/KXLbDHz78S2AX4To9?g_st=ac",
  whatsappNumber: "+62 881-0265-64160",
  whatsappUrl: "https://wa.me/62881026564160",
};

export const waLinkWithMessage = (message) =>
  `${restaurant.whatsappUrl}?text=${encodeURIComponent(message)}`;

export const menuNasiGoreng = [
  { name: "Nasi Goreng Biasa", price: "10K" },
  { name: "Nasi Goreng Mawut", price: "12K" },
  {
    name: "Nasi Goreng Pataya",
    price: "14K",
    desc: "Nasi goreng dibungkus dengan telur",
  },
  {
    name: "Nasi Goreng U.S.A",
    price: "18K",
    desc: "Nasi goreng dengan topping udang, cumi, dan sayur",
  },
  {
    name: "Nasi Goreng Kampung",
    price: "8K",
    desc: "Nasi goreng tanpa kecap dengan topping teri dan pete",
  },
  {
    name: "Nasi Goreng China",
    price: "15K",
    desc: "Nasi goreng dengan topping udang dan sayur seperti nasi goreng biasa & kacang panjang",
  },
];

export const menuMieGoreng = [
  {
    name: "Mie Goreng Biasa",
    price: "9K",
    desc: "Mie dengan topping ayam cincang dan kerupuk pangsit",
  },
  {
    name: "Mie Goreng Kuah",
    price: "9K",
    desc: "Mie dengan tambahan kuah",
  },
  {
    name: "Mie Goreng Udang",
    price: "14K",
    desc: "Mie goreng dengan topping udang",
  },
  {
    name: "Mie Goreng Campur",
    price: "12K",
    desc: "Mie goreng dengan topping sosis",
  },
];

export const menuMinuman = [
  { name: "Air Mineral", price: null },
  { name: "Teh Manis", price: "3K" },
  { name: "Marimas Jeruk", price: "2K" },
  { name: "Marimas Jambu", price: "2K" },
  { name: "Marimas Mangga", price: "2K" },
  { name: "Joshua", price: "5K", desc: "Extrajos + susu" },
  { name: "Kubisu", price: "5K", desc: "Kukubima + susu" },
];

export const promoNote =
  "Khusus pembelian hari Jum'at, free es teh untuk yang makan di tempat.";
