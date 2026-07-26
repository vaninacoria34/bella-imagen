const products = [
  // ── PERFUMES ──
  {
    id: 1,
    title: "Perfume Rosé",
    category: "Perfumes",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
    description:
      "Un perfume elegante y sofisticado, ideal para acompañar tus días.",
    availability: "Disponible",
  },
  {
    id: 2,
    title: "Floral Bloom",
    category: "Perfumes",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80",
    description:
      "Notas florales intensas que despiertan los sentidos. Perfecto para el día a día.",
    availability: "Disponible",
  },
  {
    id: 3,
    title: "Fresh Cotton",
    category: "Perfumes",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&q=80",
    description:
      "Fragancia suave y fresca con aroma a algodón limpio. Ideal para el uso diario.",
    availability: "Disponible",
  },
  {
    id: 4,
    title: "Ámbar Noche",
    category: "Perfumes",
    price: 36000,
    image:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80",
    description:
      "Una fragancia intensa y cálida con notas amaderadas. Perfecta para ocasiones especiales.",
    availability: "Disponible",
  },

  // ── MAQUILLAJE ──
  {
    id: 5,
    title: "Kit Makeup Pink",
    category: "Maquillaje",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    description:
      "Tu kit favorito en tonos pink para lograr un look perfecto en minutos.",
    availability: "Disponible",
  },
  {
    id: 6,
    title: "Labial Matte",
    category: "Maquillaje",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80",
    description:
      "Labial matte con gran cobertura para un acabado intenso y duradero.",
    availability: "Disponible",
  },
  {
    id: 7,
    title: "Base Líquida Velvet",
    category: "Maquillaje",
    price: 12500,
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&q=80",
    description:
      "Base de cobertura media a alta con acabado velvet natural. Ideal para todo tipo de piel.",
    availability: "Disponible",
  },
  {
    id: 8,
    title: "Sombra Glitter",
    category: "Maquillaje",
    price: 7200,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    description:
      "Sombra de ojos con glitter fino para un look brillante y glamoroso.",
    availability: "Disponible",
  },
  {
    id: 9,
    title: "Rubor Tostado",
    category: "Maquillaje",
    price: 9800,
    image:
      "https://images.unsplash.com/photo-1599733589046-10c7f0c6c6e6?w=400&q=80",
    description:
      "Rubor en polvo con acabado natural. Da un toque de color saludable a tus mejillas.",
    availability: "Disponible",
  },

  // ── SKINCARE ──
  {
    id: 10,
    title: "Crema Hidratante Facial",
    category: "Skincare",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    description:
      "Crema hidratante de rápida absorción con ácido hialurónico. Piel suave todo el día.",
    availability: "Disponible",
  },
  {
    id: 11,
    title: "Sérum Vitamina C",
    category: "Skincare",
    price: 21000,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    description:
      "Sérum concentrado con Vitamina C para iluminar y unificar el tono de la piel.",
    availability: "Disponible",
  },
  {
    id: 12,
    title: "Protector Solar SPF 50",
    category: "Skincare",
    price: 13500,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    description:
      "Protección solar de amplio espectro FPS 50. Liviano y libre de aceites.",
    availability: "Disponible",
  },
  {
    id: 13,
    title: "Limpiador Facial Espuma",
    category: "Skincare",
    price: 9500,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    description:
      "Limpiador en espuma que elimina impurezas y maquillaje sin resecar la piel.",
    availability: "Disponible",
  },
  {
    id: 14,
    title: "Tónico Refrescante",
    category: "Skincare",
    price: 8200,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80",
    description:
      "Tónico con agua de rosas y aloe vera. Refresca, calma y prepara la piel.",
    availability: "Disponible",
  },

  // ── MARROQUINERÍA ──
  {
    id: 15,
    title: "Billetera Cuero Clásica",
    category: "Marroquinería",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
    description:
      "Billetera de cuero genuino con múltiples compartimentos. Elegante y funcional.",
    availability: "Disponible",
  },
  {
    id: 16,
    title: "Cinturón Cuero Premium",
    category: "Marroquinería",
    price: 19500,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    description:
      "Cinturón de cuero premium con hebilla dorada. Un básico para cualquier outfit.",
    availability: "Disponible",
  },
  {
    id: 17,
    title: "Mochila Cuero Artesanal",
    category: "Marroquinería",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    description:
      "Mochila artesanal de cuero vacuno. Espaciosa, resistente y con estilo único.",
    availability: "Disponible",
  },
  {
    id: 18,
    title: "Portafolio Ejecutivo",
    category: "Marroquinería",
    price: 38000,
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&q=80",
    description:
      "Portafolio de cuero con compartimento para notebook. Ideal para el día a día laboral.",
    availability: "Disponible",
  },

  // ── BISUTERÍA ──
  {
    id: 19,
    title: "Collar Dorado Básico",
    category: "Bisutería",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    description:
      "Collar dorado de cadena fina con cierre ajustable. El toque elegante que necesitás.",
    availability: "Disponible",
  },
  {
    id: 20,
    title: "Aros Plateados Argolla",
    category: "Bisutería",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c8ab60908?w=400&q=80",
    description:
      "Aros de argolla plateados. Clásicos, versátiles y combinables con cualquier look.",
    availability: "Disponible",
  },
  {
    id: 21,
    title: "Pulsera Charm Corazón",
    category: "Bisutería",
    price: 7800,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
    description:
      "Pulsera con charms de corazón y estrella. Dulce y delicada para regalar o regalarte.",
    availability: "Disponible",
  },
  {
    id: 22,
    title: "Anillo Ajustable Dorado",
    category: "Bisutería",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
    description:
      "Anillo dorado ajustable con diseño minimalista. Ideal para usar a diario o combinar.",
    availability: "Disponible",
  },

  // ── ACCESORIOS (existentes para compatibilidad con Navbar) ──
  {
    id: 23,
    title: "Cartera Elegante Negra",
    category: "Carteras",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80",
    description:
      "Cartera negra de diseño elegante con compartimentos. Perfecta para cualquier ocasión.",
    availability: "Disponible",
  },
  {
    id: 24,
    title: "Bolso Tote Diario",
    category: "Bolsos",
    price: 29000,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    description:
      "Bolso tote amplio y cómodo para llevar todo lo que necesitás en tu día.",
    availability: "Disponible",
  },

  // ── ACCESORIOS (nueva categoría) ──
  {
    id: 25,
    title: "Lentes de Sol Vintage",
    category: "Accesorios",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    description:
      "Lentes de sol con marco vintage y protección UV. El toque chic que tu look necesita.",
    availability: "Disponible",
  },
  {
    id: 26,
    title: "Pañuelo Seda Estampado",
    category: "Accesorios",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80",
    description:
      "Pañuelo de seda suave con estampado floral. Versátil para usar en el cuello, el pelo o el bolso.",
    availability: "Disponible",
  },
  {
    id: 27,
    title: "Set de Scrunchies",
    category: "Accesorios",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80",
    description:
      "Pack de 6 scrunchies de terciopelo en tonos pastel. Suaves con tu cabello y súper trendy.",
    availability: "Disponible",
  },
  {
    id: 28,
    title: "Neceser Organizador",
    category: "Accesorios",
    price: 9800,
    image:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80",
    description:
      "Neceser impermeable con múltiples compartimentos. Ideal para guardar tus maquillajes y accesorios.",
    availability: "Disponible",
  },
];

export default products;

