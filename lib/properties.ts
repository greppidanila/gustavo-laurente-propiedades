export interface PropertyUnit {
  name: string;
  environments: number;
  area: number; // in m2
  price: string; // e.g. "USD 160.000" or "CONSULTAR"
}

export interface PropertyImage {
  url: string;
  title: string;
}

export interface PropertyPlan {
  url: string;
  title: string;
}

export interface PropertyItem {
  id: string;
  type: 'vivienda' | 'comercial' | 'terreno' | 'campo';
  isDevelopment: boolean; // True for "Emprendimientos", False for "Propiedades"
  title: string;
  price: string; // e.g. "Desde USD 160.000" or "USD 2.350.000"
  originalPrice?: string; // Discount original price
  numericPrice: number; // for filtering
  unitsCount?: number; // e.g. 28 UNIDADES
  environments: number[]; // e.g. [1, 2, 3, 4, 5]
  location: string;
  neighborhood: string;
  city: string;
  province: string;
  status: 'En Obra' | 'Terminado' | 'Lanzamiento' | 'Venta' | 'Alquiler' | 'Vendido' | 'Alquilado' | 'Reservado';
  possession?: string; // e.g. "Febrero 2027"
  mainImage: string;
  gallery: PropertyImage[];
  plans?: PropertyPlan[];
  description: string;
  surfaceCubierta?: number; // in m2
  surfaceTotal?: number; // in m2
  dormitorios?: number;
  banos?: number;
  toilettes?: number;
  units?: PropertyUnit[];
  agent?: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  addedDate?: string;
}

export interface FullanaLot {
  id: number;
  number: string;
  status: 'Disponible' | 'Reservado' | 'Vendido';
  area: number; // in m2
  price: string;
  priceNum: number;
  dimensions: string; // e.g. "12m x 30m"
  isCommercial: boolean;
}

// Generate the 33 lotes for Monte Fullana
export const FULLANA_LOTS: FullanaLot[] = Array.from({ length: 33 }).map((_, index) => {
  const id = index + 1;
  const isVendido = [5, 12, 18, 22, 29, 33].includes(id);
  const isCommercial = [1, 2, 3, 30, 31, 32].includes(id);
  
  const width = isCommercial ? 15 : 12;
  const length = isCommercial ? 40 : 30;
  const area = width * length;
  
  return {
    id,
    number: `Lote ${id}`,
    status: isVendido ? 'Vendido' : 'Disponible',
    area,
    price: isCommercial ? `USD ${(area * 40).toLocaleString('es-AR')}` : `USD ${(area * 30).toLocaleString('es-AR')}`,
    priceNum: isCommercial ? area * 40 : area * 30,
    dimensions: `${width}m x ${length}m`,
    isCommercial
  };
});

export const DEVELOPMENTS: PropertyItem[] = [
  {
    id: "monte-fullana",
    type: "terreno",
    isDevelopment: true,
    title: "Monte Fullana - Loteo Residencial",
    price: "Consultar Financiación",
    numericPrice: 15000,
    unitsCount: 33,
    environments: [1],
    location: "Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Lanzamiento",
    possession: "Inmediata",
    mainImage: "https://picsum.photos/seed/fullana_main/800/600",
    description: "Monte Fullana propone una nueva forma de vivir en Pergamino: una comunidad planificada, rodeada de naturaleza y con infraestructura preparada para construir tu futuro. Presentamos 33 exclusivos lotes en 29.200 mts totalmente forestados, asegurando calidad de vida en una comunidad planificada y una ubicación privilegiada. Ofrecemos financiación flexible con un anticipo del 30% y saldo en hasta 36 cuotas sin interés en dólares o cuotas adaptadas.",
    gallery: [
      { url: "https://picsum.photos/seed/fullana_landscape/800/600", title: "Entorno Forestado de Monte Fullana" },
      { url: "https://picsum.photos/seed/fullana_aerial/800/600", title: "Vista Aérea del Proyecto" },
      { url: "https://picsum.photos/seed/fullana_entrance/800/600", title: "Acceso Principal y Calles Pavimentadas" },
      { url: "https://picsum.photos/seed/fullana_park/800/600", title: "Árboles Preservados y Espacios Verdes" }
    ],
    plans: [
      { url: "https://picsum.photos/seed/fullana_layout/800/600", title: "Plano del Loteo Completo" }
    ],
    units: FULLANA_LOTS.map(lot => ({
      name: `${lot.number} (${lot.isCommercial ? 'Comercial' : 'Residencial'}) - ${lot.dimensions}`,
      environments: 1,
      area: lot.area,
      price: lot.status === 'Vendido' ? 'VENDIDO' : lot.price
    })),
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    }
  }
];

export const PROPERTIES: PropertyItem[] = [
  {
    id: "las-flores-1664",
    type: "vivienda",
    isDevelopment: false,
    title: "¡Excelente casa de 3 dormitorios con pileta en VENTA!",
    price: "USD 115.000",
    numericPrice: 115000,
    environments: [3],
    location: "1664, Las Flores, Champagnat, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Champagnat",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/champagnat_house/800/600",
    description: "Inmejorable propiedad ubicada en la calle Las Flores 1664, Barrio Champagnat de Pergamino. Cuenta con un diseño funcional y muy luminoso, un hermoso living-comedor, cocina totalmente equipada, tres dormitorios confortables, un jardín amplio parquizado con una magnífica piscina y cochera cubierta. Ideal para disfrutar en familia.",
    surfaceCubierta: 126,
    surfaceTotal: 300,
    dormitorios: 3,
    banos: 1,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/champagnat_garden/800/600", title: "Jardín y Piscina" },
      { url: "https://picsum.photos/seed/champagnat_living/800/600", title: "Living con Ventanales" }
    ],
    agent: {
      name: "Marcos Tello",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/tello_avatar/150/150"
    },
    addedDate: "hace 4 semanas"
  },
  {
    id: "diego-garcia-752",
    type: "vivienda",
    isDevelopment: false,
    title: "¡Amplia Casa en VENTA , Barrio Viajantes!",
    price: "USD 180.000",
    numericPrice: 180000,
    environments: [3],
    location: "752, Diego M. García (13), Viajantes, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Viajantes",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/viajantes_house/800/600",
    description: "Excelente residencia de gran solidez constructiva en Barrio Viajantes. Desarrollada sobre dos lotes parquizados, cuenta con amplio estar comedor, cocina con isla y mobiliarios de algarrobo, dos dormitorios en planta baja, gran suite con vestidor en planta alta, playroom, galería semi-cubierta con asador y gran piscina climatizada.",
    surfaceCubierta: 166,
    surfaceTotal: 450,
    dormitorios: 2,
    banos: 4,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/viajantes_living/800/600", title: "Estar y Quincho" }
    ],
    agent: {
      name: "Marcos Tello",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/tello_avatar/150/150"
    },
    addedDate: "hace 1 mes"
  },
  {
    id: "pellegrini-3212",
    type: "vivienda",
    isDevelopment: false,
    title: "Excelente casa en Venta Ciudad Deportiva",
    price: "USD 300.000",
    numericPrice: 300000,
    environments: [3],
    location: "3212, Avenida Carlos Pellegrini, Atahualpa Yupanqui, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Ciudad Deportiva",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/fullana_entrance/800/600",
    description: "Excelente casa en Venta Ciudad Deportiva, ubicada estratégicamente sobre la Avenida Carlos Pellegrini 3212. Ofrece una infraestructura de primer nivel, materiales de categoría, amplio living integrado, suite principal y jardín forestado con cochera cubierta.",
    surfaceCubierta: 177,
    surfaceTotal: 380,
    dormitorios: 2,
    banos: 3,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/gpaz_living/800/600", title: "Interiores" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 mes"
  },
  {
    id: "carpani-costa-840",
    type: "vivienda",
    isDevelopment: false,
    title: "Excelente Casa en Venta en Pergamino",
    price: "USD 160.000",
    numericPrice: 160000,
    environments: [4],
    location: "840, General Carpani Costa, 27 de Noviembre, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "27 de Noviembre",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/laurente_hero/800/600",
    description: "Excelente Casa en Venta en Pergamino, sobre la calle General Carpani Costa 840. Dispone de tres dormitorios muy cómodos, living estar independiente, cocina-comedor totalmente reciclada a nuevo, patio trasero parquizado y cochera para dos vehículos.",
    surfaceCubierta: 261,
    surfaceTotal: 350,
    dormitorios: 3,
    banos: 2,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/sjulia_exterior/800/600", title: "Fachada" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 meses"
  },
  {
    id: "balboa-816",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta en Barrio Centenario !",
    price: "USD 100.000",
    numericPrice: 100000,
    environments: [4],
    location: "816, Balboa, Centenario, Pergamino, Partido de Pergamino, Buenos Aires, B2700KIU, Argentina",
    neighborhood: "Centenario",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/sjulia_exterior/800/600",
    description: "Casa en venta en Barrio Centenario, ubicada en la calle Balboa 816. Gran distribución interna con tres amplias habitaciones, living acogedor, cocina-comedor diario integrada, cochera cubierta y un hermoso patio seco con asador.",
    surfaceCubierta: 179,
    surfaceTotal: 240,
    dormitorios: 3,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/gpaz_kitchen/800/600", title: "Cocina" }
    ],
    agent: {
      name: "Marcos Tello",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/tello_avatar/150/150"
    },
    addedDate: "hace 3 meses"
  },
  {
    id: "triana-69",
    type: "vivienda",
    isDevelopment: false,
    title: "En venta ,Casa con amplio terreno en PINZON.",
    price: "USD 45.000",
    numericPrice: 45000,
    environments: [3],
    location: "69, Rodrigo de Triana, Pinzón, Partido de Pergamino, Buenos Aires, Argentina",
    neighborhood: "Pinzón",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/pinzon_house/800/600",
    description: "Encantadora propiedad de campo en el tranquilo paraje de Pinzón (Partido de Pergamino). Ideal para casa de fin de semana o descanso de la ciudad. Cuenta con un parque espectacular y forestado de 1000m², dos dormitorios cómodos, cocina comedor con estufa hogar y galería techada.",
    surfaceCubierta: 100,
    surfaceTotal: 1000,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/pinzon_patio/800/600", title: "Parque Arbolado" }
    ],
    agent: {
      name: "Marcos Tello",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/tello_avatar/150/150"
    },
    addedDate: "hace 3 meses"
  },
  {
    id: "estrada-1521",
    type: "vivienda",
    isDevelopment: false,
    title: "Venta Casa a Remodelar habitable",
    price: "USD 65.000",
    numericPrice: 65000,
    environments: [3],
    location: "1521, Estrada, Centro, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/gpaz_depto/800/600",
    description: "Venta Casa a Remodelar habitable, sobre la calle Estrada 1521 en el centro de Pergamino. Excelente oportunidad de inversión por precio de lote. Desarrollada en una planta, cuenta con dos dormitorios, estar, baño completo y pequeño patio.",
    surfaceCubierta: 85,
    surfaceTotal: 120,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/gpaz_living/800/600", title: "Interiores" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 4 meses"
  },
  {
    id: "fuente-584",
    type: "vivienda",
    isDevelopment: false,
    title: "VENTA HERMOSA CASA EXCELENTE CONSTRUCCION",
    price: "USD 83.000",
    numericPrice: 83000,
    environments: [4],
    location: "584, Manuel de la Fuente, Acevedo, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Acevedo",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Alquilado",
    mainImage: "https://picsum.photos/seed/rojas_house/800/600",
    description: "VENTA HERMOSA CASA EXCELENTE CONSTRUCCION en Barrio Acevedo, calle Manuel de la Fuente 584. Cuenta con tres confortables dormitorios, living, cocina amplia, baño y cochera. Se encuentra actualmente alquilada, ideal para inversores.",
    surfaceCubierta: 150,
    surfaceTotal: 220,
    dormitorios: 3,
    banos: 1,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/rojas_patio/800/600", title: "Patio" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 5 meses"
  },
  {
    id: "lavalle-167",
    type: "vivienda",
    isDevelopment: false,
    title: "VENTA CASA ROJAS",
    price: "USD 45.000",
    numericPrice: 45000,
    environments: [3],
    location: "167, Lavalle, Rojas, Partido de Rojas, Buenos Aires, B2705ACG, Argentina",
    neighborhood: "Rojas",
    city: "Rojas",
    province: "Buenos Aires",
    status: "Alquilado",
    mainImage: "https://picsum.photos/seed/rojas_living/800/600",
    description: "VENTA CASA ROJAS, ubicada en la calle Lavalle 167. Desarrollada sobre planta baja, con dos dormitorios amplios de techos altos, baño completo y un patio interno. Se encuentra actualmente alquilada, ofreciendo una renta estable en el centro de Rojas.",
    surfaceCubierta: 89,
    surfaceTotal: 150,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/rojas_living/800/600", title: "Estar comedor" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 5 meses"
  },
  {
    id: "san-salvador-1750",
    type: "vivienda",
    isDevelopment: false,
    title: "Venta Exclusiva casa con amplio parque",
    price: "USD 120.000",
    numericPrice: 120000,
    environments: [2],
    location: "1750, San Salvador, San Vicente, Pergamino, Partido de Pergamino, Buenos Aires, B2700KIU, Argentina",
    neighborhood: "San Vicente",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/sansalvador_house/800/600",
    description: "Exclusiva casa en venta con un gran parque arbolado y espacios amplios en Barrio San Vicente. Excelente solidez constructiva, distribución de ambientes ideal para familias y ubicación tranquila de alta demanda.",
    surfaceCubierta: 110,
    surfaceTotal: 310,
    dormitorios: 1,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/sansalvador_garden/800/600", title: "Vista del parque" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 5 meses"
  },
  {
    id: "alberdi-3166",
    type: "vivienda",
    isDevelopment: false,
    title: "Excelente Casa en Venta 3 dorm",
    price: "USD 150.000",
    numericPrice: 150000,
    environments: [4],
    location: "3166, Alberdi, Loteo Solares I, Santa Julia, Pergamino, Partido de Pergamino, Buenos Aires, B2700FBM, Argentina",
    neighborhood: "Santa Julia",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/solares_house/800/600",
    description: "Hermosa propiedad a estrenar con detalles de diseño en Loteo Solares I, Barrio Santa Julia. Cuenta con tres amplios dormitorios, el principal en suite, gran living comedor integrado y cochera para dos vehículos.",
    surfaceCubierta: 150,
    surfaceTotal: 300,
    dormitorios: 3,
    banos: 2,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/solares_int/800/600", title: "Living" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 7 meses"
  },
  {
    id: "ramon-raimundo-1098",
    type: "vivienda",
    isDevelopment: false,
    title: "Venta Casa B°Acevedo",
    price: "USD 55.000",
    numericPrice: 55000,
    environments: [3],
    location: "1098, Ramón Raimundo, Ameghino, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Ameghino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/raimundo_house/800/600",
    description: "Funcional casa a la venta en Barrio Acevedo / Ameghino. Cuenta con garage cubierto, dos dormitorios, cocina cómoda y patio seco. Ideal para primera vivienda.",
    surfaceCubierta: 75,
    surfaceTotal: 150,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/raimundo_patio/800/600", title: "Patio" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 7 meses"
  },
  {
    id: "matheu-495",
    type: "vivienda",
    isDevelopment: false,
    title: "Venta Casa B° Acevedo",
    price: "USD 61.000",
    numericPrice: 61000,
    environments: [3],
    location: "495, Matheu, Ameghino, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Ameghino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/matheu_house/800/600",
    description: "Propiedad bien ubicada sobre calle Matheu en Barrio Acevedo. Excelente estado de conservación, dos habitaciones cómodas, cocina con mobiliario y un patio parquizado de tamaño ideal.",
    surfaceCubierta: 65,
    surfaceTotal: 130,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/matheu_living/800/600", title: "Living comedor" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 7 meses"
  },
  {
    id: "3-de-febrero-580",
    type: "vivienda",
    isDevelopment: false,
    title: "EXCELENTE casa en venta – Centro de Pergamino",
    price: "USD 155.000",
    numericPrice: 155000,
    environments: [4],
    location: "3 de Febrero 580, Centro, Pergamino, Partido de Pergamino, Buenos Aires, Argentina",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/3febrero_house/800/600",
    description: "Imponente casa residencial de categoría ubicada en pleno centro de Pergamino. Gran terreno de 400m² con cochera, tres dormitorios, living señorial, escritorio y dependencia de servicios.",
    surfaceCubierta: 220,
    surfaceTotal: 400,
    dormitorios: 3,
    banos: 1,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/3febrero_hall/800/600", title: "Hall central" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 8 meses"
  },
  {
    id: "arrecifes-casa",
    type: "vivienda",
    isDevelopment: false,
    title: "Venta Casa Arrecifes",
    price: "USD 120.000",
    numericPrice: 120000,
    environments: [4],
    location: "Arrecifes, Partido de Arrecifes, Buenos Aires, Argentina",
    neighborhood: "Arrecifes",
    city: "Arrecifes",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/arrecifes_house/800/600",
    description: "Se vende excelente propiedad en la vecina ciudad de Arrecifes. Ubicación destacada con tres amplios dormitorios, living comedor confortable, garaje para vehículos y patio parquizado.",
    surfaceCubierta: 120,
    surfaceTotal: 250,
    dormitorios: 3,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/arrecifes_int/800/600", title: "Estar comedor" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 8 meses"
  },
  {
    id: "general-paz-176",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa a Refaccionar en Centro de Pergamino — Excelente Construcción y Ubicación",
    price: "USD 135.000",
    numericPrice: 135000,
    environments: [4],
    location: "176, General Paz, Centro, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/gpaz_house/800/600",
    description: "Excelente oportunidad para remodelar. Propiedad con inmejorable estructura céntrica de techos altos y ambientes amplios, tres dormitorios, patio interno y cochera.",
    surfaceCubierta: 180,
    surfaceTotal: 380,
    dormitorios: 3,
    banos: 2,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/gpaz_patio/800/600", title: "Patio tradicional" }
    ],
    agent: {
      name: "Marcos Tello",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/tello_avatar/150/150"
    },
    addedDate: "hace 9 meses"
  },
  {
    id: "baldomero-moreno-498",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta en B°la Amalia",
    price: "USD 215.000",
    numericPrice: 215000,
    environments: [4],
    location: "498, Baldomero Fernández Moreno, La Amalia, Pergamino, Partido de Pergamino, Buenos Aires, 2701, Argentina",
    neighborhood: "La Amalia",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Reservado",
    mainImage: "https://picsum.photos/seed/amalia_house/800/600",
    description: "Excelente e imponente propiedad sobre gran lote de 923m² en el cotizado Barrio La Amalia. Jardín parquizado con pileta, tres habitaciones, terminaciones de categoría.",
    surfaceCubierta: 210,
    surfaceTotal: 923,
    dormitorios: 3,
    banos: 2,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/amalia_park/800/600", title: "Gran parque" }
    ],
    agent: {
      name: "Marcos Tello",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/tello_avatar/150/150"
    },
    addedDate: "hace 9 meses"
  },
  {
    id: "pueyrredon-2590",
    type: "vivienda",
    isDevelopment: false,
    title: "Espectacular casa con amplio parque",
    price: "USD 90.000",
    numericPrice: 90000,
    environments: [4],
    location: "2590, Pueyrredón, Martín Illia, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Martín Illia",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/pueyrredon_house/800/600",
    description: "Espectacular propiedad con un terreno enorme totalmente cercado en Barrio Illia. Cuenta con tres dormitorios, estar integrado muy luminoso y galerías exteriores.",
    surfaceCubierta: 130,
    surfaceTotal: 211,
    dormitorios: 3,
    banos: 2,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/pueyrredon_patio/800/600", title: "Galería" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 año"
  },
  {
    id: "lorenzo-moreno-554",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa a remodelar con garage y patio",
    price: "USD 70.000",
    numericPrice: 70000,
    environments: [3],
    location: "554, Lorenzo Moreno, Trocha, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Trocha",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/lorenzomoreno_house/800/600",
    description: "Casa céntrica ideal para proyecto comercial o residencial a remodelar en zona de alta circulación. Cuenta con amplia cochera para varios autos y patio trasero.",
    surfaceCubierta: 110,
    surfaceTotal: 220,
    dormitorios: 2,
    banos: 3,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/lorenzo_int/800/600", title: "Interiores" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 año"
  },
  {
    id: "monteagudo-450",
    type: "vivienda",
    isDevelopment: false,
    title: "Ph céntrico señorial con patio",
    price: "USD 95.000",
    numericPrice: 95000,
    environments: [4],
    location: "450, Monteagudo, Centro, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/monteagudo_house/800/600",
    description: "Exclusivo PH con impronta señorial en pleno centro. Detalles arquitectónicos de estilo clásico, tres habitaciones confortables y hermoso patio privado.",
    surfaceCubierta: 120,
    surfaceTotal: 150,
    dormitorios: 3,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/monteagudo_living/800/600", title: "Estar señorial" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 año"
  },
  {
    id: "general-pinto-1161",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa Centrica a Reciclar amplio lote",
    price: "USD 65.000",
    numericPrice: 65000,
    environments: [3],
    location: "1161, General Pinto, Centro, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/pintocasa_main/800/600",
    description: "Lote excepcional en zona céntrica con edificación a reciclar o demoler. Gran potencial constructivo.",
    surfaceCubierta: 90,
    surfaceTotal: 120,
    dormitorios: 2,
    banos: 2,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/pinto_lot/800/600", title: "Lote" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 año"
  },
  {
    id: "pascual-raimundo-2439",
    type: "vivienda",
    isDevelopment: false,
    title: "Venta hermosa casa B°Champagnat.",
    price: "USD 132.000",
    originalPrice: "USD 150.000",
    numericPrice: 132000,
    environments: [4],
    location: "2439, Pascual Raimundo, Champagnat, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Champagnat",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/champ_new_house/800/600",
    description: "Excelente e impecable propiedad de tres dormitorios, tres baños en Barrio Champagnat. Amplia cocina, living, excelente calidad constructiva, con valor de oportunidad rebajado de USD 150.000.",
    surfaceCubierta: 166,
    surfaceTotal: 250,
    dormitorios: 3,
    banos: 3,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/champ_int/800/600", title: "Detalles del estar" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 año"
  },
  {
    id: "larrea-970",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en Venta céntrica 2 dormitorios",
    price: "USD 80.000",
    originalPrice: "USD 85.000",
    numericPrice: 80000,
    environments: [3],
    location: "970, Larrea, Centro, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/larrea_house/800/600",
    description: "Casa céntrica sobre la calle Larrea al 970. Dos amplias habitaciones, living acogedor, excelente ubicación cerca de comercios y colegios.",
    surfaceCubierta: 90,
    surfaceTotal: 120,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/larrea_int/800/600", title: "Cocina" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 año"
  },
  {
    id: "las-casuarinas-2300",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en barrio semi cerrado El Molino a terminar",
    price: "USD 68.000",
    numericPrice: 68000,
    environments: [3],
    location: "2300, Las Casuarinas, La Guarida, Pergamino, Partido de Pergamino, Buenos Aires, 2700, Argentina",
    neighborhood: "La Guarida",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/casuarinas_house/800/600",
    description: "Excelente lote en barrio semi cerrado El Molino, propiedad con estructura de dos dormitorios a terminar. Ideal para personalizar los acabados a tu gusto.",
    surfaceCubierta: 90,
    surfaceTotal: 300,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/casuarinas_lot/800/600", title: "Lote forestado" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 1 año"
  },
  {
    id: "prudencio-gonzalez-1421",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios en Pergamino",
    price: "USD 35.000",
    numericPrice: 35000,
    environments: [3],
    location: "Prudencio González 1421, Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/prudencio_house/800/600",
    description: "Oportunidad económica imperdible en Pergamino. Casa de 2 dormitorios, dos baños, gran lote de 298m². Ideal inversores.",
    surfaceCubierta: 120,
    surfaceTotal: 298,
    dormitorios: 2,
    banos: 2,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/prudencio_patio/800/600", title: "Gran patio" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "gral-paz-1407",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios c/ cochera en Pergamino",
    price: "USD 80.000",
    numericPrice: 80000,
    environments: [3],
    location: "Gral. Paz 1407, Pergamino, Buenos Aires",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/gpaz_house_1407/800/600",
    description: "Excelente estado, dos habitaciones, un baño, living integrado y cochera cubierta sobre calle principal.",
    surfaceCubierta: 110,
    surfaceTotal: 119,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/gpaz_interior_1407/800/600", title: "Interiores" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "gral-paz-1407-cochera",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios c/ cochera en Pergamino",
    price: "USD 80.000",
    numericPrice: 80000,
    environments: [3],
    location: "Gral. Paz, Pergamino, Buenos Aires",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/gpaz_cochera_sec/800/600",
    description: "Excelente propiedad de gran solidez constructiva, dos dormitorios muy amplios, dos baños completos, garage amplio y patio seco de 136m² totales.",
    surfaceCubierta: 100,
    surfaceTotal: 136,
    dormitorios: 2,
    banos: 2,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/gpaz_sec_int/800/600", title: "Living comedor" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "belgrano-1349",
    type: "vivienda",
    isDevelopment: false,
    title: "Hermosa casa en venta Pergamino, oportunidad.",
    price: "USD 230.000",
    numericPrice: 230000,
    environments: [5],
    location: "Belgrano 1349, Pergamino, Buenos Aires",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/belgrano_house/800/600",
    description: "Oportunidad de categoría sobre la tradicional calle Belgrano. 4 dormitorios, 3 baños completos, imponente recepción, jardín arbolado con quincho sobre generoso lote de 500m².",
    surfaceCubierta: 280,
    surfaceTotal: 500,
    dormitorios: 4,
    banos: 3,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/belgrano_quincho/800/600", title: "Quincho y jardín" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "poetas-pergaminenses-738",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa con pileta, 2 dorm",
    price: "USD 120.000",
    numericPrice: 120000,
    environments: [3],
    location: "Poetas Pergaminences 738, Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Reservado",
    mainImage: "https://picsum.photos/seed/poetas_house/800/600",
    description: "Encantadora propiedad con magnífica piscina parquizada, dos dormitorios cómodos, dos baños, cochera y asador sobre lote de 350m².",
    surfaceCubierta: 110,
    surfaceTotal: 350,
    dormitorios: 2,
    banos: 2,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/poetas_pool/800/600", title: "Piscina y deck" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "general-pinto-1379",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios c/ cochera en Pergamino",
    price: "USD 48.000",
    numericPrice: 48000,
    environments: [3],
    location: "General Pinto 1379, Pergamino, Buenos Aires",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Reservado",
    mainImage: "https://picsum.photos/seed/pinto_1379_house/800/600",
    description: "Excelente propiedad de dos habitaciones, un baño y cochera. Se encuentra reservada, con todos los papeles al día listos para escriturar.",
    surfaceCubierta: 90,
    surfaceTotal: 198,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/pinto_interior/800/600", title: "Interiores" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "mar-del-plata-463",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios c/ cochera en Pergamino",
    price: "USD 87.000",
    numericPrice: 87000,
    environments: [3],
    location: "Mar del Plata 463, Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Vendido",
    mainImage: "https://picsum.photos/seed/mardelplata_house/800/600",
    description: "VENDIDA. Confortable casa de dos habitaciones con cochera, excelente asador y gran jardín. Operación realizada con éxito.",
    surfaceCubierta: 110,
    surfaceTotal: 250,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/mardelplata_patio/800/600", title: "Patio" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "bartolome-mitre-1160",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 4 dormitorios c/ cochera en Pergamino",
    price: "USD 165.000",
    numericPrice: 165000,
    environments: [5],
    location: "Bartolomé Mitre 1160, Pergamino, Buenos Aires",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/mitre_house/800/600",
    description: "Categoría en Centro de Pergamino. Amplia fachada, 4 dormitorios en planta alta, 3 baños completos, imponente living de recepción y garage cubierto.",
    surfaceCubierta: 240,
    surfaceTotal: 426,
    dormitorios: 4,
    banos: 3,
    toilettes: 1,
    gallery: [
      { url: "https://picsum.photos/seed/mitre_int/800/600", title: "Salón principal" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "la-plata-212",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 1 dormitorio en Pergamino",
    price: "USD 52.000",
    numericPrice: 52000,
    environments: [3],
    location: "La Plata 212, Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/laplata_house/800/600",
    description: "Muy buena casa sobre amplio lote de 303m². Cuenta con dos habitaciones, un baño y espacio libre para construir o quincho.",
    surfaceCubierta: 80,
    surfaceTotal: 303,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/laplata_patio/800/600", title: "Jardín" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "11-de-septiembre-160",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios en Pergamino",
    price: "USD 98.000",
    numericPrice: 98000,
    environments: [3],
    location: "11 de Septiembre 160, Pergamino, Buenos Aires",
    neighborhood: "Centro",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/11sept_house/800/600",
    description: "Tradicional casa sobre importante lote de 360m² a pocas cuadras de peatonal San Nicolás. Dos dormitorios cómodos, living estar y cochera.",
    surfaceCubierta: 110,
    surfaceTotal: 360,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/11sept_int/800/600", title: "Sala de recepción" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "av-dr-jauretche-50",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios c/ cochera en Pergamino",
    price: "USD 85.000",
    numericPrice: 85000,
    environments: [3],
    location: "AV DR. Jauretche 50, Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Vendido",
    mainImage: "https://picsum.photos/seed/jauretche_house/800/600",
    description: "VENDIDA. Inmejorable ubicación y estado general, dos habitaciones, dos baños y cochera sobre Av. Jauretche.",
    surfaceCubierta: 120,
    surfaceTotal: 359,
    dormitorios: 2,
    banos: 2,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/jauretche_int/800/600", title: "Living integrado" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "paso-1120",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios c/ cochera en Villa San José",
    price: "USD 60.000",
    numericPrice: 60000,
    environments: [3],
    location: "Paso 1120 Villa San José, Pergamino, Buenos Aires",
    neighborhood: "Villa San José",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/pasosanjose_house/800/600",
    description: "Excelente propiedad en Villa San José sobre calle Paso. Dos dormitorios cómodos, amplio baño, garaje y hermoso parque de 300m².",
    surfaceCubierta: 100,
    surfaceTotal: 300,
    dormitorios: 2,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/pasosanjose_int/800/600", title: "Interiores" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "irlanda-285",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 2 dormitorios c/ cochera en Pergamino",
    price: "USD 36.000",
    originalPrice: "USD 38.000",
    numericPrice: 36000,
    environments: [3],
    location: "Irlanda 285, Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Vendido",
    mainImage: "https://picsum.photos/seed/irlanda_house/800/600",
    description: "VENDIDA. Operación exitosa. Casa de dos habitaciones con dos baños, patio de 559m² totales sobre calle Irlanda.",
    surfaceCubierta: 90,
    surfaceTotal: 559,
    dormitorios: 2,
    banos: 2,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/irlanda_garden/800/600", title: "Vista del gran patio" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  },
  {
    id: "castelli-998",
    type: "vivienda",
    isDevelopment: false,
    title: "Casa en venta de 3 dormitorios c/ cochera en Pergamino",
    price: "Consultar precio",
    numericPrice: 0,
    environments: [4],
    location: "Castelli 998, Pergamino, Buenos Aires",
    neighborhood: "Pergamino",
    city: "Pergamino",
    province: "Buenos Aires",
    status: "Venta",
    mainImage: "https://picsum.photos/seed/castelli_house/800/600",
    description: "Excelente propiedad de tres amplias habitaciones sobre calle Castelli. Muy buena distribución, un baño completo, cocina-comedor amplia y patio cómodo.",
    surfaceCubierta: 110,
    surfaceTotal: 146,
    dormitorios: 3,
    banos: 1,
    toilettes: 0,
    gallery: [
      { url: "https://picsum.photos/seed/castelli_int/800/600", title: "Cocina comedor" }
    ],
    agent: {
      name: "Gustavo Laurente",
      phone: "2477 210864",
      email: "gustavo_laurente@hotmail.com",
      avatar: "https://picsum.photos/seed/laurente_avatar/150/150"
    },
    addedDate: "hace 2 años"
  }
];

export const NEIGHBORHOODS = [
  { id: "pergamino", name: "Pergamino", count: "+100 propiedades", image: "https://picsum.photos/seed/pergamino_city/800/600" },
  { id: "rojas", name: "Rojas", count: "12 propiedades", image: "https://picsum.photos/seed/rojas_city/800/600" },
  { id: "pinzon", name: "Pinzón", count: "4 propiedades", image: "https://picsum.photos/seed/pinzon_land/800/600" }
];

export const INVESTMENT_OPTIONS = [
  {
    title: "COMPRÁ EN LOTEO RESIDENCIAL",
    subtitle: "INVERSIÓN EN MONTE FULLANA",
    image: "https://picsum.photos/seed/fullana_lot_invest/400/600",
    description: "Accedé a terrenos exclusivos con un 30% de anticipo y hasta 36 cuotas sin interés. Monte Fullana es un loteo planificado con alta plusvalía y entorno natural único."
  },
  {
    title: "PROPIEDADES CON POTENCIAL",
    subtitle: "EXCELENTE RENTABILIDAD Y REVENTA",
    image: "https://picsum.photos/seed/potential_invest/400/600",
    description: "Buscamos propiedades para remodelar o a refaccionar con valores de liquidación óptimos, permitiendo altos retornos de capital en plazos cortos."
  },
  {
    title: "PROYECTOS INMOBILIARIOS",
    subtitle: "PLANIFICACIÓN URBANA Y FUTURO",
    image: "https://picsum.photos/seed/project_invest/400/600",
    description: "Invertí en el crecimiento urbano sostenido de Pergamino participando de loteos con infraestructura y servicios garantizados de primer nivel."
  },
  {
    title: "OPORTUNIDADES ESPECIALES",
    subtitle: "VALORES ACTUALIZADOS Y ACCESIBLES",
    image: "https://picsum.photos/seed/special_invest/400/600",
    description: "Propiedades con precios rebajados significativamente y condiciones flexibles de pago para que no dejes pasar tu oportunidad."
  }
];

export const LOTS_LANDS = [
  {
    title: "Monte Fullana",
    description: "33 lotes residenciales y comerciales en comunidad planificada. El mejor loteo con forestación natural de Pergamino.",
    image: "https://picsum.photos/seed/lote_fullana/600/400",
    linkId: "monte-fullana"
  }
];
