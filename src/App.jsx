import { useState, useEffect, useReducer, createContext, useContext, useCallback, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — Premium Refined
   Uses CSS vars from index.css, JS refs for inline styles
   ═══════════════════════════════════════════════════════════════ */
const C = {
  cocoa:"#2A1810", cocoaL:"#3C261C", cocoaM:"#5A3D2E",
  caramel:"#BE8E68", caramelD:"#9E7454", caramelL:"#D2AA84", caramelP:"#E8D0B4",
  vanilla:"#E4D1BC", linen:"#FAF7F3", warm:"#F3EBE1", cream:"#FFFCF8",
  mocha:"#887260", mochaL:"#A6937E",
  rose:"#C8636C", roseD:"#A84F57", roseL:"#F5D8DB",
  sage:"#4D7A5B", sageL:"#E6F0E9", sageD:"#3B6148",
  gold:"#C49A44", goldL:"#FAF2E2",
  white:"#fff", black:"#1A1612",
};
const F = { d:"'Cormorant Garamond', Georgia, serif", b:"'Outfit', -apple-system, sans-serif" };
const R = { xs:4, sm:6, md:10, lg:14, xl:18, xxl:24, pill:999 };
const SH = {
  xs:"0 1px 2px rgba(42,24,16,.04)", sm:"0 2px 6px rgba(42,24,16,.05)",
  md:"0 4px 16px rgba(42,24,16,.07)", lg:"0 8px 32px rgba(42,24,16,.09)",
  xl:"0 20px 56px rgba(42,24,16,.12)",
};

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */
const CATS = [
  {id:"all",name:"Todos los Pasteles",icon:"\uD83C\uDF70"},
  {id:"birthday",name:"Cumplea\u00f1os",icon:"\uD83C\uDF82"},
  {id:"wedding",name:"Bodas",icon:"\uD83D\uDC92"},
  {id:"custom",name:"Personalizados",icon:"\uD83C\uDFA8"},
  {id:"kids",name:"Infantiles",icon:"\uD83E\uDDF8"},
  {id:"elegant",name:"Elegantes",icon:"\u2728"},
  {id:"mini",name:"Mini Pasteles",icon:"\uD83E\uDDC1"},
  {id:"seasonal",name:"De Temporada",icon:"\uD83C\uDF38"},
];

const P = [
  {id:"b01",name:"Strawberry Dream",cat:"birthday",price:450,oldPrice:520,size:'8"',servings:"8\u201310",flavor:"Fresa y Vainilla",rating:4.8,reviews:34,prep:"24h",pickup:true,delivery:true,tags:["best-seller"],desc:"Un esponjoso bizcocho de vainilla con capas de compota de fresa fresca, betún de crema batida y rebanadas de fresa natural.",ingredients:["Harina","Huevos","Mantequilla","Fresas","Vainilla","Crema","Azúcar"],img:"https://images.pexels.com/photos/1098592/pexels-photo-1098592.jpeg?auto=compresshttps://images.pexels.com/photos/1098592/pexels-photo-1098592.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"']},
  {id:"b02",name:"Chocolate Bliss Tower",cat:"birthday",price:580,size:'8"',servings:"10\u201312",flavor:"Triple Chocolate",rating:4.9,reviews:52,prep:"24h",pickup:true,delivery:true,tags:["best-seller","popular"],desc:"Tres capas de húmedo pastel de chocolate con ganache oscuro, mousse de chocolate con leche y corona de chocolate blanco.",ingredients:["Cocoa","Harina","Huevos","Chocolate Oscuro","Crema","Mantequilla","Espresso"],img:"https://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?auto=compresshttps://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"','12"']},
  {id:"b03",name:"Vanilla Cloud",cat:"birthday",price:420,size:'8"',servings:"8\u201310",flavor:"Vainilla de Madagascar",rating:4.7,reviews:28,prep:"24h",pickup:true,delivery:true,tags:[],desc:"Suave bizcocho de vainilla con buttercream de merengue suizo. Ligero como una nube, rico en sabor, hecho con vainas reales de Madagascar.",ingredients:["Vainilla de Madagascar","Harina","Huevos","Mantequilla","Crema","Merengue"],img:"https://images.pexels.com/photos/3185509/pexels-photo-3185509.jpeg?auto=compresshttps://images.pexels.com/photos/3185509/pexels-photo-3185509.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"']},
  {id:"b04",name:"Rainbow Surprise",cat:"birthday",price:520,size:'8"',servings:"10\u201312",flavor:"Vainilla Arcoíris",rating:4.6,reviews:19,prep:"36h",pickup:true,delivery:true,tags:["popular"],desc:"Seis capas de colores ocultas bajo un suave betún blanco. ¡Córtalo y descubre la sorpresa arcoíris!",ingredients:["Harina","Huevos","Mantequilla","Vainilla","Colorantes Naturales","Queso Crema"],img:"https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compresshttps://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['8"','10"']},
  {id:"b05",name:"Lemon Zest Delight",cat:"birthday",price:460,size:'8"',servings:"8\u201310",flavor:"Limón y Flor de Saúco",rating:4.5,reviews:15,prep:"24h",pickup:true,delivery:true,tags:[],desc:"Bizcocho de limón brillante y cítrico con jarabe de flor de saúco y cremoso buttercream de limón.",ingredients:["Limones","Harina","Huevos","Flor de Saúco","Mantequilla","Crema"],img:"https://images.pexels.com/photos/1587830/pexels-photo-1587830.jpeg?auto=compresshttps://images.pexels.com/photos/1587830/pexels-photo-1587830.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"']},
  {id:"b06",name:"Caramel Macchiato",cat:"birthday",price:490,size:'8"',servings:"8\u201310",flavor:"Café y Caramelo",rating:4.7,reviews:22,prep:"24h",pickup:true,delivery:true,tags:["new"],desc:"Capas infusionadas con espresso, relleno de caramelo salado y buttercream de café para el paladar sofisticado.",ingredients:["Espresso","Harina","Huevos","Caramelo","Crema","Sal de Mar","Mantequilla"],img:"https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compresshttps://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"']},
  {id:"w01",name:"Elegant Pearl Tier",cat:"wedding",price:2450,oldPrice:2800,size:"3 pisos",servings:"60\u201380",flavor:"Vainilla y Champagne",rating:5.0,reviews:18,prep:"72h",pickup:true,delivery:true,tags:["best-seller"],desc:"Una impresionante obra maestra de tres pisos con fondant, perlas comestibles colocadas a mano y cascadas de flores de azúcar.",ingredients:["Fondant","Vainilla","Champagne","Flores de Azúcar","Perlas","Buttercream"],img:"https://images.pexels.com/photos/34596959/pexels-photo-34596959.jpeg?auto=compresshttps://images.pexels.com/photos/34596959/pexels-photo-34596959.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["2 pisos","3 pisos","4 pisos"]},
  {id:"w02",name:"Rustic Garden",cat:"wedding",price:1980,size:"2 pisos",servings:"40\u201350",flavor:"Limón y Lavanda",rating:4.9,reviews:12,prep:"72h",pickup:true,delivery:false,tags:["popular"],desc:"Acabado semi-desnudo con ramitas de lavanda fresca, frutos rojos de temporada y delicado bizcocho de limón-lavanda.",ingredients:["Lavanda","Limón","Frutos Rojos","Harina","Queso Crema","Huevos"],img:"https://images.pexels.com/photos/31243101/pexels-photo-31243101.jpeg?auto=compresshttps://images.pexels.com/photos/31243101/pexels-photo-31243101.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["2 pisos","3 pisos"]},
  {id:"w03",name:"Marble Royale",cat:"wedding",price:3200,size:"3 pisos",servings:"80\u2013100",flavor:"Chocolate y Vainilla",rating:4.8,reviews:8,prep:"96h",pickup:false,delivery:true,tags:["premium"],desc:"Impresionante exterior de fondant marmoleado con acentos de hoja de oro. Capas alternadas de chocolate y vainilla.",ingredients:["Fondant","Hoja de Oro","Chocolate Oscuro","Vainilla","Crema","Mantequilla"],img:"https://images.pexels.com/photos/3014858/pexels-photo-3014858.jpeg?auto=compresshttps://images.pexels.com/photos/3014858/pexels-photo-3014858.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["3 pisos","4 pisos","5 pisos"]},
  {id:"w04",name:"Blush Peony",cat:"wedding",price:2750,size:"3 pisos",servings:"70\u201390",flavor:"Rosa y Pistacho",rating:4.9,reviews:14,prep:"72h",pickup:true,delivery:true,tags:["new"],desc:"Delicado betún ombré rosa con peonías de azúcar hechas a mano y relleno de crema de pistacho.",ingredients:["Agua de Rosa","Pistacho","Harina","Huevos","Crema","Fondant"],img:"https://images.pexels.com/photos/11389911/pexels-photo-11389911.jpeg?auto=compresshttps://images.pexels.com/photos/11389911/pexels-photo-11389911.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["2 pisos","3 pisos"]},
  {id:"c01",name:"Photo Cake Classic",cat:"custom",price:550,size:'10"',servings:"12\u201315",flavor:"Elige Tu Sabor",rating:4.6,reviews:41,prep:"48h",pickup:true,delivery:true,tags:["popular"],desc:"Tu foto favorita impresa en papel comestible sobre un delicioso pastel. Sube cualquier imagen y la hacemos realidad.",ingredients:["Personalizado","Tinta Comestible","Fondant","Bizcocho a Elegir"],img:"https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compresshttps://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['8"','10"','12"']},
  {id:"c02",name:"Sculpted Fantasy",cat:"custom",price:1200,size:"Personalizado",servings:"20\u201330",flavor:"Selección Personalizada",rating:4.9,reviews:9,prep:"96h",pickup:true,delivery:false,tags:["premium"],desc:"Un pastel 3D totalmente esculpido a tu medida. Autos, animales, edificios\u2014si lo sueñas, lo horneamos.",ingredients:["Fondant Esculpido","Estructura de Rice Krispie","Sabores Personalizados"],img:"https://images.pexels.com/photos/3992134/pexels-photo-3992134.jpeg?auto=compresshttps://images.pexels.com/photos/3992134/pexels-photo-3992134.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["Chico","Mediano","Grande"]},
  {id:"c03",name:"Number Cake",cat:"custom",price:480,size:"Estándar",servings:"10\u201314",flavor:"Vainilla y Frutos Rojos",rating:4.7,reviews:23,prep:"36h",pickup:true,delivery:true,tags:["popular"],desc:"Moderno pastel en forma de número con macarons, frutos rojos frescos y besos de merengue.",ingredients:["Hojaldre","Crema Diplomática","Frutos Rojos","Macarons","Merengue"],img:"https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compresshttps://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["Un Dígito","Dos Dígitos"]},
  {id:"k01",name:"Unicorn Magic",cat:"kids",price:520,size:'8"',servings:"10\u201312",flavor:"Algodón de Azúcar y Vainilla",rating:4.8,reviews:37,prep:"36h",pickup:true,delivery:true,tags:["best-seller"],desc:"Mágico pastel arcoíris pastel con cuerno dorado, orejas de fondant y melena de candy melts.",ingredients:["Vainilla","Algodón de Azúcar","Fondant","Candy Melts","Chispas"],img:"https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compresshttps://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"']},
  {id:"k02",name:"Dino Explorer",cat:"kids",price:480,size:'8"',servings:"8\u201310",flavor:"Chocolate y Galletas",rating:4.6,reviews:21,prep:"36h",pickup:true,delivery:true,tags:["popular"],desc:"Aventura prehistórica con dinosaurios de fondant, salsa de volcán en erupción y tierra de galleta.",ingredients:["Chocolate","Galletas","Fondant","Crema","Caramelo"],img:"https://images.pexels.com/photos/18131293/pexels-photo-18131293.jpeg?auto=compresshttps://images.pexels.com/photos/18131293/pexels-photo-18131293.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['8"','10"']},
  {id:"k03",name:"Princess Castle",cat:"kids",price:650,size:'10"',servings:"12\u201315",flavor:"Fresa y Crema",rating:4.9,reviews:16,prep:"48h",pickup:true,delivery:true,tags:[],desc:"Pastel de castillo con torres, puente levadizo y flores de azúcar. Rosa y dorado digno de la realeza.",ingredients:["Fresa","Crema","Fondant","Palitos de Oblea","Decoraciones de Azúcar"],img:"https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compresshttps://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['8"','10"']},
  {id:"k04",name:"Space Galaxy",cat:"kids",price:510,size:'8"',servings:"8\u201310",flavor:"Arándano y Vainilla",rating:4.7,reviews:13,prep:"36h",pickup:true,delivery:true,tags:["new"],desc:"Glaseado espejo morado con estrellas de brillantina comestible, cohete de fondant y cake pops de planetas.",ingredients:["Arándano","Vainilla","Glaseado Espejo","Brillantina Comestible","Fondant"],img:"https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg?auto=compresshttps://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"']},
  {id:"e01",name:"Midnight Velvet",cat:"elegant",price:680,size:'8"',servings:"10\u201312",flavor:"Red Velvet y Queso Crema",rating:4.9,reviews:29,prep:"24h",pickup:true,delivery:true,tags:["best-seller"],desc:"Capas carmesí profundo con betún de queso crema, fragmentos de chocolate oscuro y hojuelas de oro comestible.",ingredients:["Red Velvet","Queso Crema","Chocolate Oscuro","Oro Comestible","Cocoa"],img:"https://images.pexels.com/photos/2267868/pexels-photo-2267868.jpeg?auto=compresshttps://images.pexels.com/photos/2267868/pexels-photo-2267868.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"']},
  {id:"e02",name:"Opera Noir",cat:"elegant",price:720,size:'8"',servings:"8\u201310",flavor:"Café, Chocolate y Almendra",rating:4.8,reviews:11,prep:"48h",pickup:true,delivery:true,tags:["premium"],desc:"Clásico francés\u2014delgado bizcocho de almendra con jarabe de café, ganache de chocolate y buttercream de café.",ingredients:["Almendra","Espresso","Chocolate Oscuro","Mantequilla","Hoja de Oro"],img:"https://images.pexels.com/photos/806363/pexels-photo-806363.jpeg?auto=compresshttps://images.pexels.com/photos/806363/pexels-photo-806363.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"']},
  {id:"e03",name:"Gilded Rose",cat:"elegant",price:890,size:'10"',servings:"12\u201315",flavor:"Pistacho y Frambuesa",rating:5.0,reviews:7,prep:"48h",pickup:true,delivery:true,tags:["new","premium"],desc:"Pinceladas doradas a mano, rosas de azúcar y relleno de pistacho con frambuesa. Nuestra creación más artística.",ingredients:["Pistacho","Frambuesa","Fondant","Pintura de Oro","Crema"],img:"https://images.pexels.com/photos/3026803/pexels-photo-3026803.jpeg?auto=compresshttps://images.pexels.com/photos/3026803/pexels-photo-3026803.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['8"','10"']},
  {id:"e04",name:"Black Forest Luxe",cat:"elegant",price:560,size:'8"',servings:"8\u201310",flavor:"Cereza y Chocolate Oscuro",rating:4.7,reviews:20,prep:"24h",pickup:true,delivery:true,tags:["popular"],desc:"Nuestra versión elevada del Selva Negra\u2014chocolate bañado en Kirsch, compota de cereza Morello y crema Chantilly.",ingredients:["Chocolate Oscuro","Cerezas Morello","Kirsch","Crema Chantilly"],img:"https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?auto=compresshttps://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"']},
  {id:"m01",name:"Cupcake Box (12)",cat:"mini",price:280,size:"12 pzas",servings:"12",flavor:"Sabores Surtidos",rating:4.7,reviews:45,prep:"12h",pickup:true,delivery:true,tags:["best-seller"],desc:"Una docena de cupcakes decorados a mano en vainilla, chocolate, red velvet y limón.",ingredients:["Masas Surtidas","Buttercream","Chispas"],img:"https://images.pexels.com/photos/239325/pexels-photo-239325.jpeg?auto=compresshttps://images.pexels.com/photos/239325/pexels-photo-239325.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["6 pzas","12 pzas","24 pzas"]},
  {id:"m02",name:"Macaron Tower",cat:"mini",price:450,size:"30 pzas",servings:"30",flavor:"Surtido de Macarons Franceses",rating:4.8,reviews:19,prep:"24h",pickup:true,delivery:false,tags:["popular"],desc:"30 macarons franceses en rosa, pistacho, chocolate, caramelo salado y lavanda.",ingredients:["Harina de Almendra","Claras de Huevo","Rellenos Variados"],img:"https://images.pexels.com/photos/3776939/pexels-photo-3776939.jpeg?auto=compresshttps://images.pexels.com/photos/3776939/pexels-photo-3776939.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["15 pzas","30 pzas","50 pzas"]},
  {id:"m03",name:"Cake Pop Bouquet",cat:"mini",price:320,size:"15 pzas",servings:"15",flavor:"Chocolate y Vainilla",rating:4.5,reviews:27,prep:"24h",pickup:true,delivery:true,tags:[],desc:"Cake pops bañados a mano en un hermoso ramo con decoración artesanal.",ingredients:["Migajas de Pastel","Queso Crema","Candy Melts","Chispas"],img:"https://images.pexels.com/photos/1998633/pexels-photo-1998633.jpeg?auto=compresshttps://images.pexels.com/photos/1998633/pexels-photo-1998633.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:["10 pzas","15 pzas","25 pzas"]},
  {id:"s01",name:"Spring Blossom",cat:"seasonal",price:540,size:'8"',servings:"8\u201310",flavor:"Maracuyá y Mango",rating:4.8,reviews:8,prep:"24h",pickup:true,delivery:true,tags:["seasonal","new"],desc:"Capas tropicales de maracuyá y mango con flores comestibles y crema de coco.",ingredients:["Maracuyá","Mango","Crema de Coco","Flores Comestibles","Vainilla"],img:"https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compresshttps://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"']},
  {id:"s02",name:"Mexican Hot Chocolate",cat:"seasonal",price:490,size:'8"',servings:"8\u201310",flavor:"Chocolate, Canela y Chile",rating:4.9,reviews:14,prep:"24h",pickup:true,delivery:true,tags:["seasonal","popular"],desc:"Inspirado en el champurrado\u2014rico chocolate mexicano, buttercream de canela y sutil calidez de chile ancho.",ingredients:["Chocolate Mexicano","Canela","Chile Ancho","Piloncillo","Crema"],img:"https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?auto=compresshttps://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"','10"']},
  {id:"s03",name:"Tres Leches Fiesta",cat:"seasonal",price:380,size:'9"\u00d713"',servings:"15\u201320",flavor:"Tres Leches",rating:4.9,reviews:56,prep:"12h",pickup:true,delivery:true,tags:["best-seller","popular"],desc:"Nuestro legendario tres leches\u2014esponjoso bizcocho bañado en tres leches, crema batida y fruta fresca.",ingredients:["Leche Condensada","Leche Evaporada","Crema","Bizcocho de Vainilla","Frutos Rojos"],img:"https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compresshttps://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['8"','9"\u00d713"']},
  {id:"s04",name:"Dulce de Leche Swirl",cat:"seasonal",price:510,size:'8"',servings:"8\u201310",flavor:"Dulce de Leche y Plátano",rating:4.6,reviews:10,prep:"24h",pickup:true,delivery:true,tags:["seasonal","new"],desc:"Capas de plátano caramelizado con cintas de dulce de leche y merengue tostado.",ingredients:["Dulce de Leche","Plátano","Merengue","Vainilla","Mantequilla"],img:"https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compresshttps://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",sizes:['6"','8"']},
];

const REVIEWS = [
  {id:1,name:"Ana Guti\u00e9rrez",text:"El Strawberry Dream qued\u00f3 absolutamente perfecto para la quincea\u00f1era de mi hija. \u00a1Todos quer\u00edan saber d\u00f3nde lo pedimos!",rating:5,loc:"Centro, Mexicali"},
  {id:2,name:"Carlos Mendoza",text:"El Tres Leches Fiesta para nuestra reuni\u00f3n familiar\u2014se acab\u00f3 en minutos. El mejor que he probado en Mexicali.",rating:5,loc:"Nuevo Mexicali"},
  {id:3,name:"Mar\u00eda Elena Torres",text:"La consulta para el pastel de bodas fue incre\u00edblemente profesional y el Elegant Pearl Tier super\u00f3 nuestros sue\u00f1os.",rating:5,loc:"Puerta del Sol"},
  {id:4,name:"Roberto S\u00e1nchez",text:"El Unicorn Magic hizo el cumplea\u00f1os de mi hija verdaderamente m\u00e1gico. La atenci\u00f3n al detalle es extraordinaria.",rating:5,loc:"Catavi\u00f1a"},
];

const FAQ_DATA = [
  {q:"\u00bfHacen entregas fuera de Mexicali?",a:"Actualmente las entregas est\u00e1n disponibles solo dentro de los l\u00edmites de la ciudad de Mexicali. Para otras zonas, pueden recoger su pedido en nuestra sucursal del Blvd. L\u00e1zaro C\u00e1rdenas."},
  {q:"\u00bfCon cu\u00e1nta anticipaci\u00f3n debo hacer mi pedido?",a:"Pasteles est\u00e1ndar: 24 horas. Pasteles personalizados y de boda: 3\u20137 d\u00edas dependiendo de la complejidad. Consulta cada p\u00e1gina de producto para tiempos espec\u00edficos de preparaci\u00f3n."},
  {q:"\u00bfPuedo personalizar sabores o decoraciones?",a:"La mayor\u00eda de nuestros pasteles ofrecen opciones de tama\u00f1o y sabor. Para dise\u00f1os completamente personalizados, visita nuestra secci\u00f3n de Personalizados o cont\u00e1ctanos por WhatsApp para una consulta gratuita."},
  {q:"\u00bfQu\u00e9 m\u00e9todos de pago aceptan?",a:"Todas las tarjetas de cr\u00e9dito y d\u00e9bito principales, pagos en OXXO y efectivo al recoger. Los pedidos en l\u00ednea usan nuestro sistema de pago seguro."},
  {q:"\u00bfAtienden restricciones alimentarias?",a:"Ofrecemos opciones sin gluten y sin nueces para pasteles selectos. Cont\u00e1ctanos directamente para discutir tus necesidades espec\u00edficas."},
  {q:"\u00bfCu\u00e1l es su pol\u00edtica de cancelaci\u00f3n?",a:"Puedes cancelar hasta 48 horas antes de la fecha programada para un reembolso completo. Los pasteles personalizados y de boda tienen pol\u00edticas separadas\u2014consulta al momento de ordenar."},
];

const PROMOS = { WELCOME10:{disc:.10,label:"10% de descuento",min:0}, DULCE15:{disc:.15,label:"15% en pedidos mayores a $800",min:800}, FREESHIP:{disc:0,label:"Env\u00edo gratis",free:true,min:500} };

/* Badge label map (Spanish) */
const BADGE_ES = {"best-seller":"m\u00e1s vendido","popular":"popular","new":"nuevo","seasonal":"temporada","premium":"premium"};

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════ */
const fmt = n => `$${n.toLocaleString("en-US")}`;
const orderId = () => `RC-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
const cartId = () => `ci_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

const Stars = ({r,sz=14,num=false}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
    <span style={{display:"inline-flex",gap:1,color:C.gold}}>{[1,2,3,4,5].map(i=><span key={i} style={{fontSize:sz,opacity:i<=Math.floor(r)?1:i-r<1?.5:.15}}>{"\u2605"}</span>)}</span>
    {num&&<span style={{fontSize:sz-1,color:C.mocha,fontWeight:500}}>{r}</span>}
  </span>
);

/* ═══════════════════════════════════════════════════════════════
   CART STATE — Production-ready architecture
   ═══════════════════════════════════════════════════════════════ */
const CartCtx = createContext();
const CART0 = {items:[],saved:[],promo:null,promoData:null};

function cartR(s,a) {
  switch(a.t) {
    case "ADD": {
      const ex = s.items.find(i=>i.pid===a.p.pid&&i.size===a.p.size);
      return ex ? {...s,items:s.items.map(i=>i===ex?{...i,qty:i.qty+(a.p.qty||1)}:i)} : {...s,items:[...s.items,{...a.p,cid:cartId(),qty:a.p.qty||1,notes:a.p.notes||"",at:Date.now()}]};
    }
    case "RM": return {...s,items:s.items.filter(i=>i.cid!==a.cid)};
    case "QTY": return {...s,items:s.items.map(i=>i.cid===a.cid?{...i,qty:Math.max(1,Math.min(20,a.q))}:i)};
    case "SIZE": return {...s,items:s.items.map(i=>i.cid===a.cid?{...i,size:a.sz}:i)};
    case "NOTE": return {...s,items:s.items.map(i=>i.cid===a.cid?{...i,notes:a.n}:i)};
    case "SAVE": { const it=s.items.find(i=>i.cid===a.cid); return it?{...s,items:s.items.filter(i=>i.cid!==a.cid),saved:[...s.saved,{...it,savedAt:Date.now()}]}:s; }
    case "UNSAVE": { const it=s.saved.find(i=>i.cid===a.cid); return it?{...s,saved:s.saved.filter(i=>i.cid!==a.cid),items:[...s.items,{...it,at:Date.now()}]}:s; }
    case "RMSAVE": return {...s,saved:s.saved.filter(i=>i.cid!==a.cid)};
    case "PROMO": { const p=PROMOS[a.code?.toUpperCase()]; return p?{...s,promo:a.code.toUpperCase(),promoData:p}:{...s,promo:null,promoData:null}; }
    case "RMPROMO": return {...s,promo:null,promoData:null};
    case "CLEAR": return {...CART0,saved:s.saved};
    default: return s;
  }
}

function CartProv({children}) {
  const [s,d] = useReducer(cartR,CART0);
  const [toast,setToast] = useState(null);
  const [drawer,setDrawer] = useState(false);
  const [lastRm,setLastRm] = useState(null);
  const tmr = useRef(null);

  const notify = useCallback((msg,type="add",undo=null) => {
    if(tmr.current) clearTimeout(tmr.current);
    setToast({msg,type,undo}); tmr.current = setTimeout(()=>{setToast(null);setLastRm(null);},4000);
  },[]);

  const add = useCallback((p,size,qty=1,notes="") => {
    d({t:"ADD",p:{pid:p.id,name:p.name,price:p.price,img:p.img,size,qty,notes}});
    notify(p.name,"add"); setDrawer(true);
  },[notify]);

  const rm = useCallback(cid => {
    const it = s.items.find(i=>i.cid===cid);
    if(it){setLastRm(it);notify(it.name,"rm",it);}
    d({t:"RM",cid});
  },[s.items,notify]);

  const undo = useCallback(()=>{
    if(lastRm){d({t:"ADD",p:lastRm});setLastRm(null);setToast(null);}
  },[lastRm]);

  const setQ = useCallback((cid,q)=>d({t:"QTY",cid,q}),[]);
  const setSz = useCallback((cid,sz)=>d({t:"SIZE",cid,sz}),[]);
  const setN = useCallback((cid,n)=>d({t:"NOTE",cid,n}),[]);
  const save = useCallback(cid=>{const it=s.items.find(i=>i.cid===cid);d({t:"SAVE",cid});if(it)notify(it.name,"saved");},[s.items,notify]);
  const unsave = useCallback(cid=>d({t:"UNSAVE",cid}),[]);
  const rmSave = useCallback(cid=>d({t:"RMSAVE",cid}),[]);
  const promo = useCallback(code=>d({t:"PROMO",code}),[]);
  const rmPromo = useCallback(()=>d({t:"RMPROMO"}),[]);
  const clear = useCallback(()=>d({t:"CLEAR"}),[]);

  const sub = s.items.reduce((a,i)=>a+i.price*i.qty,0);
  const cnt = s.items.reduce((a,i)=>a+i.qty,0);
  const disc = s.promoData ? Math.round(sub*(s.promoData.disc||0)) : 0;

  return <CartCtx.Provider value={{...s,add,rm,undo,setQ,setSz,setN,save,unsave,rmSave,promo,rmPromo,clear,sub,cnt,disc,toast,drawer,setDrawer}}>{children}</CartCtx.Provider>;
}
const useCart = () => useContext(CartCtx);

/* ── Router ── */
const RCtx = createContext();
function RP({children}) {
  const [r,setR] = useState({pg:"home",p:{}});
  const go = useCallback((pg,p={})=>{setR({pg,p});window.scrollTo({top:0,behavior:"smooth"});},[]);
  return <RCtx.Provider value={{...r,go}}>{children}</RCtx.Provider>;
}
const useR = () => useContext(RCtx);

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS — Premium Refined
   ═══════════════════════════════════════════════════════════════ */
const Badge = ({label,v="default"}) => {
  const m = {"best-seller":{bg:C.rose,c:"#fff"},popular:{bg:C.caramel,c:"#fff"},new:{bg:C.sage,c:"#fff"},seasonal:{bg:C.gold,c:"#fff"},premium:{bg:C.cocoa,c:C.caramelL},default:{bg:C.warm,c:C.mocha}};
  const s = m[v]||m.default;
  return <span style={{display:"inline-block",background:s.bg,color:s.c,fontSize:10,fontWeight:700,padding:"4px 11px",borderRadius:R.pill,letterSpacing:.8,textTransform:"uppercase",lineHeight:1.2}}>{label}</span>;
};

const Btn = ({children,v="primary",sz="md",onClick,style:ex,disabled,...rest}) => {
  const [h,setH] = useState(false);
  const base = {border:"none",cursor:disabled?"default":"pointer",fontFamily:F.b,fontWeight:600,borderRadius:R.md,transition:"all .25s cubic-bezier(.25,.1,.25,1)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,opacity:disabled?.45:1,whiteSpace:"nowrap",letterSpacing:.2};
  const szs = {sm:{fontSize:13,padding:"9px 18px"},md:{fontSize:14,padding:"12px 26px"},lg:{fontSize:15,padding:"15px 34px"}};
  const vs = {
    primary:{background:h?C.caramelD:C.caramel,color:"#fff",transform:h&&!disabled?"translateY(-1px)":"none",boxShadow:h?`0 4px 14px ${C.caramelP}`:"none"},
    secondary:{background:"transparent",color:C.caramel,border:`1.5px solid ${C.caramel}`,...(h&&{background:C.caramel,color:"#fff"})},
    dark:{background:h?C.cocoaL:C.cocoa,color:"#fff",transform:h&&!disabled?"translateY(-1px)":"none",boxShadow:h?SH.md:"none"},
    rose:{background:h?C.roseD:C.rose,color:"#fff",transform:h&&!disabled?"translateY(-1px)":"none"},
    ghost:{background:h?C.warm:"transparent",color:C.mocha},
    whatsapp:{background:h?"#1EBE56":"#25D366",color:"#fff",transform:h&&!disabled?"translateY(-1px)":"none"},
  };
  return <button {...rest} disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{...base,...szs[sz],...vs[v],...ex}}>{children}</button>;
};

/* Decorative divider */
const SectionDivider = () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,padding:"8px 0"}}>
    <div style={{width:40,height:1,background:C.caramelP}} />
    <span style={{fontSize:8,color:C.caramelL}}>{"\u25C6"}</span>
    <div style={{width:40,height:1,background:C.caramelP}} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   PRODUCT CARD — Premium
   ═══════════════════════════════════════════════════════════════ */
const Card = ({product:p, index=0, onAdd}) => {
  const [h,setH] = useState(false);
  const [ld,setLd] = useState(false);
  const {go} = useR();
  const tag = p.tags[0];
  const cat = CATS.find(c=>c.id===p.cat)?.name;

  return (
    <div onClick={()=>go("product",{id:p.id})} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:C.white,borderRadius:R.xl,overflow:"hidden",border:`1px solid ${h?C.caramelP:C.vanilla}`,cursor:"pointer",position:"relative",
        transform:h?"translateY(-6px) scale(1.01)":"translateY(0) scale(1)",
        boxShadow:h?SH.lg:SH.xs,transition:"all .35s cubic-bezier(.25,.1,.25,1)",
        animation:"fadeSlideUp .6s ease both",animationDelay:`${Math.min(index*70,500)}ms`}}>

      {/* Image */}
      <div style={{position:"relative",paddingTop:"85%",background:`linear-gradient(145deg,${C.warm},${C.vanilla})`,overflow:"hidden"}}>
        <img src={p.img} alt={p.name} loading="lazy" onLoad={()=>setLd(true)}
          style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",
            transition:"transform .6s cubic-bezier(.25,.1,.25,1),opacity .4s",
            transform:h?"scale(1.06)":"scale(1)",opacity:ld?1:0}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(42,24,16,.4) 0%,transparent 40%)",opacity:h?1:0,transition:"opacity .35s"}} />
        {tag && <div style={{position:"absolute",top:14,left:14,zIndex:2}}><Badge label={BADGE_ES[tag]||tag} v={tag}/></div>}
        {p.oldPrice && <div style={{position:"absolute",top:14,right:14,background:C.rose,color:"#fff",padding:"4px 10px",borderRadius:R.pill,fontSize:10.5,fontWeight:700}}>-{Math.round((1-p.price/p.oldPrice)*100)}%</div>}

        {/* Quick add overlay */}
        <div onClick={e=>{e.stopPropagation();onAdd?.(p);}}
          style={{position:"absolute",bottom:14,left:14,right:14,zIndex:2,
            background:"rgba(255,255,255,.96)",backdropFilter:"blur(10px)",
            borderRadius:R.md,padding:"11px 16px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            opacity:h?1:0,transform:h?"translateY(0)":"translateY(10px)",
            transition:"all .3s cubic-bezier(.25,.1,.25,1)",boxShadow:SH.md,cursor:"pointer"}}>
          <span style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:C.cocoa}}>Agregar Rápido</span>
          <span style={{width:26,height:26,borderRadius:"50%",background:C.caramel,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,transition:"transform .2s",transform:h?"rotate(0)":"rotate(-90deg)"}}>+</span>
        </div>
      </div>

      {/* Content */}
      <div style={{padding:"16px 18px 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontFamily:F.b,fontSize:10.5,color:C.caramel,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2}}>{cat}</span>
          <span style={{fontFamily:F.b,fontSize:10,color:C.mochaL,background:C.warm,padding:"3px 8px",borderRadius:R.pill}}>{"\u23F1"} {p.prep}</span>
        </div>
        <h3 style={{fontFamily:F.d,fontSize:20,fontWeight:600,color:C.cocoa,margin:"0 0 6px",lineHeight:1.2,letterSpacing:-.2}}>{p.name}</h3>
        <p style={{fontFamily:F.b,fontSize:12.5,color:C.mochaL,margin:"0 0 8px",lineHeight:1.4}}>{p.flavor}</p>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
          <Stars r={p.rating} sz={12}/><span style={{fontSize:11,color:C.mochaL}}>({p.reviews})</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:6}}>
          {p.oldPrice&&<span style={{fontSize:12.5,color:C.mochaL,textDecoration:"line-through"}}>{fmt(p.oldPrice)}</span>}
          <span style={{fontSize:20,fontWeight:700,color:p.oldPrice?C.rose:C.cocoa,fontFamily:F.b}}>{fmt(p.price)}</span>
          <span style={{fontSize:10.5,color:C.mochaL,fontWeight:400}}>MXN</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   NAVBAR — Premium
   ═══════════════════════════════════════════════════════════════ */
const Nav = () => {
  const {go,pg} = useR();
  const {cnt,setDrawer} = useCart();
  const [sc,setSc] = useState(false);
  const [mob,setMob] = useState(false);

  useEffect(()=>{
    const fn=()=>setSc(window.scrollY>10);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  const links = [{l:"Inicio",p:"home"},{l:"Tienda",p:"catalog"},{l:"Contacto",p:"contact"},{l:"FAQ",p:"faq"}];

  return <>
    <nav style={{position:"sticky",top:0,zIndex:100,
      background:sc?"rgba(250,247,243,.96)":C.linen,
      backdropFilter:sc?"blur(16px) saturate(180%)":"none",
      borderBottom:sc?`1px solid ${C.vanilla}`:"1px solid transparent",
      transition:"all .35s cubic-bezier(.25,.1,.25,1)",padding:"0 28px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:72}}>
        {/* Logo */}
        <div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"baseline",gap:6}}>
          <span style={{fontSize:30,fontFamily:F.d,fontWeight:500,color:C.cocoa,letterSpacing:-.5}}>Rising</span>
          <span style={{fontSize:30,fontFamily:F.d,fontWeight:600,color:C.caramel,fontStyle:"italic",letterSpacing:-.5}}>Cakes</span>
          <span style={{fontSize:13,fontFamily:"'Dancing Script', cursive",fontWeight:500,color:C.mochaL,marginLeft:2}}>by BejaranoG</span>
        </div>

        {/* Desktop links */}
        <div className="desk-nav" style={{display:"flex",alignItems:"center",gap:32}}>
          {links.map(l=>(
            <span key={l.p} onClick={()=>go(l.p)}
              style={{fontFamily:F.b,fontSize:14,fontWeight:pg===l.p?600:400,color:pg===l.p?C.caramel:C.mocha,cursor:"pointer",
                borderBottom:pg===l.p?`2px solid ${C.caramel}`:"2px solid transparent",paddingBottom:4,
                transition:"all .2s",letterSpacing:.3}}>{l.l}</span>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div onClick={()=>setDrawer(true)} style={{position:"relative",cursor:"pointer",padding:8}}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={C.cocoa} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cnt>0&&<span style={{position:"absolute",top:1,right:1,width:18,height:18,borderRadius:"50%",background:C.rose,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",animation:"popIn .3s ease"}}>{cnt}</span>}
          </div>
          <div onClick={()=>setMob(!mob)} className="mob-btn" style={{cursor:"pointer",padding:8,display:"none"}}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={C.cocoa} strokeWidth="1.8" strokeLinecap="round">
              {mob?<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>:<><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>}
            </svg>
          </div>
        </div>
      </div>
    </nav>
    {mob&&<div style={{position:"fixed",top:72,left:0,right:0,bottom:0,zIndex:99,background:C.linen,padding:28,display:"flex",flexDirection:"column",gap:4,animation:"fadeIn .2s ease"}}>
      {links.map(l=><div key={l.p} onClick={()=>{go(l.p);setMob(false);}} style={{fontFamily:F.b,fontSize:18,fontWeight:400,color:C.cocoa,padding:"18px 0",borderBottom:`1px solid ${C.vanilla}`,cursor:"pointer",letterSpacing:.3}}>{l.l}</div>)}
      <Btn v="primary" sz="lg" onClick={()=>{setDrawer(true);setMob(false);}} style={{marginTop:24}}>Ver Carrito ({cnt})</Btn>
    </div>}
  </>;
};

/* ═══════════════════════════════════════════════════════════════
   FOOTER — Premium
   ═══════════════════════════════════════════════════════════════ */
const Foot = () => {
  const {go} = useR();
  return (
    <footer style={{background:C.cocoa,color:C.vanilla,padding:"60px 28px 36px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))",gap:40,marginBottom:40}}>
        <div>
          <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            <span style={{fontSize:26,fontFamily:F.d,fontWeight:500,color:"#fff"}}>Rising</span>
            <span style={{fontSize:26,fontFamily:F.d,fontWeight:600,color:C.caramelL,fontStyle:"italic"}}>Cakes</span>
            <span style={{fontSize:12,fontFamily:"'Dancing Script', cursive",fontWeight:500,color:C.mochaL,marginLeft:2}}>by BejaranoG</span>
          </div>
          <p style={{fontSize:14,lineHeight:1.7,color:C.caramelL,margin:0,maxWidth:280}}>Pasteles artesanales hechos con amor en Mexicali, Baja California. Cada celebraci\u00f3n merece la perfecci\u00f3n.</p>
        </div>
        <div>
          <h5 style={{fontFamily:F.b,fontSize:11,fontWeight:700,color:"#fff",margin:"0 0 16px",textTransform:"uppercase",letterSpacing:2}}>Navegación</h5>
          {[{l:"Inicio",p:"home"},{l:"Ver Todo",p:"catalog"},{l:"Contacto",p:"contact"},{l:"FAQ",p:"faq"}].map(x=><p key={x.p} onClick={()=>go(x.p)} style={{fontSize:14,color:C.caramelL,margin:"0 0 10px",cursor:"pointer",transition:"color .2s",fontWeight:300}}>{x.l}</p>)}
        </div>
        <div>
          <h5 style={{fontFamily:F.b,fontSize:11,fontWeight:700,color:"#fff",margin:"0 0 16px",textTransform:"uppercase",letterSpacing:2}}>Visítanos</h5>
          <p style={{fontSize:14,color:C.caramelL,margin:"0 0 6px",fontWeight:300}}>Blvd. L{"\u00e1"}zaro C{"\u00e1"}rdenas 500</p>
          <p style={{fontSize:14,color:C.caramelL,margin:"0 0 6px",fontWeight:300}}>Mexicali, BC 21100</p>
          <p style={{fontSize:14,color:C.caramelL,margin:"0 0 6px",fontWeight:300}}>+52 (686) 555-1234</p>
          <p style={{fontSize:14,color:C.caramelL,margin:"0 0 0",fontWeight:300}}>Mon{"\u2013"}Sat, 9:00 AM {"\u2013"} 8:00 PM</p>
        </div>
        <div>
          <h5 style={{fontFamily:F.b,fontSize:11,fontWeight:700,color:"#fff",margin:"0 0 16px",textTransform:"uppercase",letterSpacing:2}}>Conéctate</h5>
          <p style={{fontSize:14,color:C.caramelL,margin:"0 0 14px",fontWeight:300}}>@risingcakesmxl</p>
          <Btn v="whatsapp" sz="sm">Escríbenos</Btn>
        </div>
      </div>
      <div style={{borderTop:"1px solid rgba(232,213,192,.12)",paddingTop:22,textAlign:"center",fontSize:12,color:C.mochaL,fontWeight:300,letterSpacing:.3}}>
        {"\u00a9"} 2026 Rising Cakes Mexicali. Todos los derechos reservados. {"\u2022"} Solo simulación de pago.
      </div>
    </footer>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TOAST — Premium
   ═══════════════════════════════════════════════════════════════ */
const Toast = () => {
  const {toast,undo} = useCart();
  if(!toast) return null;
  const icons = {add:"\u2713",rm:"\u2716",saved:"\u2661"};
  const colors = {add:C.sage,rm:C.rose,saved:C.caramel};
  return <div style={{position:"fixed",bottom:28,right:28,zIndex:300,background:C.cocoa,color:"#fff",padding:"14px 22px",borderRadius:R.lg,fontFamily:F.b,fontSize:13.5,fontWeight:500,display:"flex",alignItems:"center",gap:12,boxShadow:SH.xl,animation:"slideUp .4s cubic-bezier(.25,.1,.25,1)",maxWidth:380}}>
    <span style={{color:colors[toast.type],fontSize:16,flexShrink:0}}>{icons[toast.type]}</span>
    <span style={{flex:1,lineHeight:1.3}}>{toast.type==="add"&&<>Agregado: <strong>{toast.msg}</strong></>}{toast.type==="rm"&&<>Eliminado: <strong>{toast.msg}</strong></>}{toast.type==="saved"&&<>Guardado: <strong>{toast.msg}</strong></>}</span>
    {toast.type==="rm"&&toast.undo&&<button onClick={undo} style={{fontFamily:F.b,fontSize:11.5,fontWeight:700,color:C.caramel,background:"none",border:`1px solid ${C.caramel}`,borderRadius:R.pill,padding:"4px 13px",cursor:"pointer"}}>Deshacer</button>}
  </div>;
};

/* ═══════════════════════════════════════════════════════════════
   CART DRAWER — Premium slide-out
   ═══════════════════════════════════════════════════════════════ */
const Drawer = () => {
  const {items,sub,cnt,disc,promoData,drawer,setDrawer,rm,setQ} = useCart();
  const {go} = useR();
  if(!drawer) return null;
  return <div style={{position:"fixed",inset:0,zIndex:250,animation:"fadeIn .2s ease"}}>
    <div onClick={()=>setDrawer(false)} style={{position:"absolute",inset:0,background:"rgba(42,24,16,.45)",backdropFilter:"blur(4px)"}} />
    <div style={{position:"absolute",top:0,right:0,bottom:0,width:"100%",maxWidth:400,background:C.cream,boxShadow:SH.xl,display:"flex",flexDirection:"column",animation:"slideInRight .3s cubic-bezier(.25,.1,.25,1)"}}>
      <div style={{padding:"22px 26px",borderBottom:`1px solid ${C.vanilla}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <h2 style={{fontFamily:F.d,fontSize:22,fontWeight:500,color:C.cocoa,margin:0}}>Tu Carrito</h2>
          {cnt>0&&<span style={{background:C.caramel,color:"#fff",fontSize:10.5,fontWeight:700,padding:"2px 9px",borderRadius:R.pill}}>{cnt}</span>}
        </div>
        <button onClick={()=>setDrawer(false)} style={{background:"none",border:"none",fontSize:24,color:C.mocha,cursor:"pointer",padding:4}}>{"\u00d7"}</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:items.length?"14px 26px":"40px 26px"}}>
        {!items.length ? <div style={{textAlign:"center",padding:"40px 0"}}><p style={{fontSize:44,margin:"0 0 12px"}}>{"\uD83D\uDED2"}</p><p style={{fontFamily:F.d,fontSize:20,color:C.cocoa,marginBottom:6}}>Tu carrito está vacío</p><p style={{fontFamily:F.b,fontSize:13.5,color:C.mocha,marginBottom:20}}>Explora nuestros pasteles y agrega tus favoritos</p><Btn v="primary" onClick={()=>{setDrawer(false);go("catalog");}}>Ver Pasteles</Btn></div> :
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {items.map(it=><div key={it.cid} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.warm}`,animation:"fadeSlideUp .3s ease"}}>
            <img src={it.img} alt={it.name} style={{width:58,height:58,borderRadius:R.md,objectFit:"cover",flexShrink:0}} />
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontFamily:F.b,fontSize:13.5,fontWeight:600,color:C.cocoa,margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.name}</p>
              <p style={{fontFamily:F.b,fontSize:11,color:C.mochaL,margin:"0 0 6px"}}>{it.size}</p>
              <div style={{display:"flex",alignItems:"center",gap:3}}>
                <button onClick={()=>setQ(it.cid,it.qty-1)} style={{width:24,height:24,borderRadius:R.sm,border:`1px solid ${C.vanilla}`,background:C.warm,cursor:"pointer",fontSize:12,color:C.cocoa,display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2212"}</button>
                <span style={{fontFamily:F.b,fontSize:13,fontWeight:700,color:C.cocoa,minWidth:20,textAlign:"center"}}>{it.qty}</span>
                <button onClick={()=>setQ(it.cid,it.qty+1)} style={{width:24,height:24,borderRadius:R.sm,border:`1px solid ${C.vanilla}`,background:C.warm,cursor:"pointer",fontSize:12,color:C.cocoa,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <p style={{fontFamily:F.b,fontSize:14,fontWeight:700,color:C.cocoa,margin:"0 0 6px"}}>{fmt(it.price*it.qty)}</p>
              <button onClick={()=>rm(it.cid)} style={{fontFamily:F.b,fontSize:11,color:C.rose,background:"none",border:"none",cursor:"pointer"}}>Eliminar</button>
            </div>
          </div>)}
        </div>}
      </div>
      {items.length>0&&<div style={{borderTop:`1px solid ${C.vanilla}`,padding:"18px 26px 22px",background:C.warm,flexShrink:0}}>
        {disc>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontFamily:F.b,fontSize:13,color:C.sage}}><span>{"\uD83C\uDF89"} Promoci\u00f3n aplicada</span><span>-{fmt(disc)}</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><p style={{fontFamily:F.b,fontSize:11.5,color:C.mochaL,margin:"0 0 2px"}}>Subtotal ({cnt} artículos)</p><p style={{fontFamily:F.d,fontSize:24,fontWeight:600,color:C.cocoa,margin:0}}>{fmt(sub-disc)} <span style={{fontFamily:F.b,fontSize:12,fontWeight:400,color:C.mochaL}}>MXN</span></p></div>
        </div>
        <Btn v="dark" sz="lg" style={{width:"100%",marginBottom:8}} onClick={()=>{setDrawer(false);go("checkout");}}>Pagar {"\u2192"} {fmt(sub-disc)} MXN</Btn>
        <Btn v="ghost" sz="md" style={{width:"100%"}} onClick={()=>{setDrawer(false);go("cart");}}>Ver Carrito Completo</Btn>
      </div>}
    </div>
  </div>;
};

/* Mobile cart bar */
const MobBar = () => {
  const {cnt,sub,drawer,setDrawer} = useCart();
  const {pg} = useR();
  if(!cnt||drawer||pg==="cart"||pg==="checkout") return null;
  return <div className="mobile-cart-bar" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:90,background:C.cocoa,padding:"14px 22px",display:"none",alignItems:"center",justifyContent:"space-between",boxShadow:"0 -4px 20px rgba(42,24,16,.15)",animation:"slideUp .3s ease"}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{position:"relative"}}><span style={{fontSize:20}}>{"\uD83D\uDED2"}</span><span style={{position:"absolute",top:-6,right:-8,width:18,height:18,borderRadius:"50%",background:C.rose,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cnt}</span></div><div><p style={{fontFamily:F.b,fontSize:11,color:C.caramelL,margin:0}}>{cnt} artículo{cnt!==1?"s":""}</p><p style={{fontFamily:F.b,fontSize:16,fontWeight:700,color:"#fff",margin:0}}>{fmt(sub)} MXN</p></div></div>
    <button onClick={()=>setDrawer(true)} style={{fontFamily:F.b,fontSize:14,fontWeight:700,color:"#fff",background:C.caramel,border:"none",borderRadius:R.md,padding:"10px 22px",cursor:"pointer"}}>Ver Carrito</button>
  </div>;
};

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE — Premium Refined
   ═══════════════════════════════════════════════════════════════ */
const Home = () => {
  const {go} = useR();
  const {add} = useCart();
  const best = P.filter(p=>p.tags.includes("best-seller")).slice(0,4);
  const pop = P.filter(p=>p.tags.includes("popular")).slice(0,4);

  return <div>
    {/* ── HERO ── */}
    <section style={{background:`linear-gradient(168deg, ${C.warm} 0%, ${C.vanilla} 35%, ${C.linen} 70%, ${C.cream} 100%)`,padding:"88px 28px 72px",position:"relative",overflow:"hidden"}}>
      {/* Decorative elements */}
      <div style={{position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.caramelP} 0%,transparent 70%)`,opacity:.3}} />
      <div style={{position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.vanilla} 0%,transparent 70%)`,opacity:.25}} />
      <div style={{position:"absolute",top:"20%",left:"10%",width:2,height:60,background:`linear-gradient(to bottom,${C.caramelP},transparent)`,opacity:.3}} />
      <div style={{position:"absolute",top:"40%",right:"15%",width:2,height:40,background:`linear-gradient(to bottom,${C.caramelP},transparent)`,opacity:.2}} />

      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:56,flexWrap:"wrap",position:"relative",zIndex:1}}>
        <div style={{flex:"1 1 500px",minWidth:300}}>
          <p style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:C.caramel,textTransform:"uppercase",letterSpacing:4,margin:"0 0 20px"}}>Hecho a Mano en Mexicali</p>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(38px,5.5vw,62px)",fontWeight:500,color:C.cocoa,lineHeight:1.08,margin:"0 0 24px",letterSpacing:-1}}>
            Cada celebración{" "}
            <span style={{display:"block"}}>merece un pastel <em style={{color:C.caramel,fontWeight:600}}>perfecto</em></span>
          </h1>
          <p style={{fontFamily:F.b,fontSize:17,color:C.mocha,lineHeight:1.7,margin:"0 0 36px",maxWidth:500,fontWeight:300}}>
            De bodas elegantes a fiestas infantiles mágicas, horneamos con pasión usando los mejores ingredientes. Ordena en línea para recoger o recibir en Mexicali.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <Btn v="primary" sz="lg" onClick={()=>go("catalog")}>Explorar Colección</Btn>
            <Btn v="secondary" sz="lg" onClick={()=>go("catalog",{cat:"wedding"})}>Pasteles de Boda</Btn>
          </div>
          {/* Trust micro */}
          <div style={{display:"flex",gap:24,marginTop:32,flexWrap:"wrap"}}>
            {[{n:"500+",l:"Pedidos"},{n:"4.9",l:"Calificación"},{n:"24h",l:"Fresco"}].map((x,i)=>(
              <div key={i}><p style={{fontFamily:F.d,fontSize:24,fontWeight:600,color:C.cocoa,margin:0}}>{x.n}</p><p style={{fontFamily:F.b,fontSize:11,color:C.mochaL,margin:0,textTransform:"uppercase",letterSpacing:1}}>{x.l}</p></div>
            ))}
          </div>
        </div>
        <div style={{flex:"1 1 420px",minWidth:300,display:"flex",justifyContent:"center"}}>
          <div style={{position:"relative",width:"100%",maxWidth:440}}>
            {/* Layered image composition */}
            <div style={{position:"relative",aspectRatio:"5/6",borderRadius:R.xxl,overflow:"hidden",boxShadow:SH.xl}}>
              <img src="https://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?auto=compresshttps://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" alt="Pastel de chocolate artesanal" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(42,24,16,.15) 0%,transparent 40%)"}} />
            </div>
            {/* Floating accent card */}
            <div style={{position:"absolute",bottom:-16,left:-20,background:C.white,borderRadius:R.xl,padding:"16px 20px",boxShadow:SH.lg,animation:"float 4s ease-in-out infinite",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:C.sageL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{"\u2713"}</div>
              <div><p style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:C.cocoa,margin:0}}>Recoger gratis</p><p style={{fontFamily:F.b,fontSize:11.5,color:C.mochaL,margin:0}}>Siguiente día hábil</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── TRUST BAR ── */}
    <section style={{background:C.white,borderBottom:`1px solid ${C.vanilla}`,padding:"20px 28px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"center",flexWrap:"wrap",gap:"10px 44px"}}>
        {[{i:"\uD83C\uDF3F",t:"Ingredientes frescos diarios"},{i:"\uD83D\uDE97",t:"Envío en Mexicali"},{i:"\uD83C\uDFA8",t:"Totalmente personalizable"},{i:"\uD83D\uDCB3",t:"Pago seguro"}].map((x,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontFamily:F.b,fontSize:13,color:C.mocha,fontWeight:400}}><span style={{fontSize:15}}>{x.i}</span>{x.t}</div>
        ))}
      </div>
    </section>

    {/* ── CATEGORIES ── */}
    <section style={{padding:"72px 28px",background:C.linen}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <SectionDivider />
          <h2 style={{fontFamily:F.d,fontSize:"clamp(28px,4vw,42px)",fontWeight:500,color:C.cocoa,margin:"12px 0 10px",letterSpacing:-.5}}>Explora Nuestra Colección</h2>
          <p style={{fontFamily:F.b,fontSize:15.5,color:C.mocha,margin:0,fontWeight:300}}>Encuentra el pastel perfecto para cada ocasión</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))",gap:16}}>
          {CATS.filter(c=>c.id!=="all").map((cat,i)=>{
            const n = P.filter(p=>p.cat===cat.id).length;
            return <CatCard key={cat.id} cat={cat} n={n} delay={i*60}/>;
          })}
        </div>
      </div>
    </section>

    {/* ── BEST SELLERS ── */}
    <ProdSec title="Nuestros Más Vendidos" sub="Los pasteles favoritos de Mexicali" items={best} />

    {/* ── HOW IT WORKS ── */}
    <section style={{padding:"72px 28px",background:C.warm}}>
      <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
        <SectionDivider />
        <h2 style={{fontFamily:F.d,fontSize:"clamp(28px,4vw,42px)",fontWeight:500,color:C.cocoa,margin:"12px 0 44px",letterSpacing:-.5}}>Cómo Funciona</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:36}}>
          {[{n:"01",t:"Elige Tu Pastel",d:"Explora nuestro cat\u00e1logo y encuentra el pastel ideal para tu celebraci\u00f3n.",i:"\uD83C\uDF70"},{n:"02",t:"Recoge o Recibe",d:"Elige recoger gratis en tienda o env\u00edo a domicilio en Mexicali.",i:"\uD83D\uDE97"},{n:"03",t:"\u00a1A Disfrutar!",d:"Recibe tu pastel reci\u00e9n horneado y crea recuerdos inolvidables.",i:"\uD83C\uDF89"}].map((s,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:18,boxShadow:SH.sm,border:`1px solid ${C.vanilla}`}}>{s.i}</div>
              <span style={{fontFamily:F.b,fontSize:11,fontWeight:700,color:C.caramel,textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>{s.n}</span>
              <h3 style={{fontFamily:F.d,fontSize:21,fontWeight:500,color:C.cocoa,margin:"0 0 8px"}}>{s.t}</h3>
              <p style={{fontFamily:F.b,fontSize:13.5,color:C.mocha,margin:0,lineHeight:1.55,maxWidth:260,fontWeight:300}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── POPULAR ── */}
    <ProdSec title="Populares Esta Semana" sub="Sabores en tendencia que no te puedes perder" items={pop} bg={C.linen} />

    {/* ── TESTIMONIALS ── */}
    <section style={{padding:"72px 28px",background:C.cream}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <SectionDivider />
          <h2 style={{fontFamily:F.d,fontSize:"clamp(28px,4vw,42px)",fontWeight:500,color:C.cocoa,margin:"12px 0 10px",letterSpacing:-.5}}>Lo Que Dicen Nuestros Clientes</h2>
          <p style={{fontFamily:F.b,fontSize:15.5,color:C.mocha,fontWeight:300}}>Reseñas reales de celebraciones reales</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))",gap:20}}>
          {REVIEWS.map(t=><div key={t.id} style={{background:C.white,borderRadius:R.xl,padding:"28px 24px",border:`1px solid ${C.vanilla}`}}>
            <Stars r={t.rating} sz={15}/>
            <p style={{fontFamily:F.b,fontSize:14,color:C.mocha,lineHeight:1.65,margin:"14px 0",fontStyle:"italic",fontWeight:300}}>{"\u201C"}{t.text}{"\u201D"}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:C.cocoa,margin:0}}>{t.name}</p>
              <span style={{fontSize:11.5,color:C.mochaL,fontWeight:300}}>{t.loc}</span>
            </div>
          </div>)}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section style={{padding:"56px 28px",background:`linear-gradient(135deg, ${C.caramel}, ${C.caramelD})`,textAlign:"center"}}>
      <h2 style={{fontFamily:F.d,fontSize:"clamp(26px,3.5vw,38px)",fontWeight:500,color:"#fff",margin:"0 0 12px",letterSpacing:-.3}}>¿Listo Para Endulzar Tu Día?</h2>
      <p style={{fontFamily:F.b,fontSize:15,color:"rgba(255,255,255,.8)",margin:"0 0 28px",fontWeight:300}}>Explora nuestro catálogo completo o escríbenos por WhatsApp</p>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn v="dark" sz="lg" onClick={()=>go("catalog")}>Ver Colección</Btn>
        <Btn v="whatsapp" sz="lg">Escríbenos</Btn>
      </div>
    </section>
  </div>;
};

/* Category card */
const CatCard = ({cat,n,delay}) => {
  const [h,setH] = useState(false);
  const {go} = useR();
  return <div onClick={()=>go("catalog",{cat:cat.id})} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{background:h?C.caramel:C.white,borderRadius:R.xl,padding:"26px 16px",textAlign:"center",cursor:"pointer",
      border:`1px solid ${C.vanilla}`,transition:"all .3s cubic-bezier(.25,.1,.25,1)",
      transform:h?"translateY(-4px) scale(1.02)":"none",
      boxShadow:h?SH.md:"none",animation:"fadeSlideUp .5s ease both",animationDelay:`${delay}ms`}}>
    <span style={{fontSize:32,display:"block",marginBottom:8,transition:"transform .3s",transform:h?"scale(1.12)":"scale(1)"}}>{cat.icon}</span>
    <p style={{fontFamily:F.d,fontSize:17,fontWeight:500,color:h?"#fff":C.cocoa,margin:"0 0 2px",transition:"color .2s"}}>{cat.name}</p>
    <p style={{fontFamily:F.b,fontSize:11.5,color:h?"rgba(255,255,255,.8)":C.mochaL,margin:0,fontWeight:300}}>{n} pasteles</p>
  </div>;
};

/* Product section */
const ProdSec = ({title,sub,items,bg=C.white}) => {
  const {go} = useR();
  const {add} = useCart();
  return <section style={{padding:"72px 28px",background:bg}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:14}}>
        <div>
          <SectionDivider />
          <h2 style={{fontFamily:F.d,fontSize:"clamp(28px,4vw,42px)",fontWeight:500,color:C.cocoa,margin:"12px 0 8px",letterSpacing:-.5}}>{title}</h2>
          <p style={{fontFamily:F.b,fontSize:15.5,color:C.mocha,margin:0,fontWeight:300}}>{sub}</p>
        </div>
        <Btn v="secondary" sz="sm" onClick={()=>go("catalog")}>Ver Todos {"\u2192"}</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))",gap:20}}>
        {items.map((p,i)=><Card key={p.id} product={p} index={i} onAdd={pr=>add(pr,pr.size)} />)}
      </div>
    </div>
  </section>;
};

/* ═══════════════════════════════════════════════════════════════
   CATALOG PAGE — Premium
   ═══════════════════════════════════════════════════════════════ */
const Catalog = () => {
  const {p} = useR();
  const {add} = useCart();
  const [cat,setCat] = useState(p.cat||"all");
  const [search,setSearch] = useState("");
  const [sort,setSort] = useState("popular");
  const [sf,setSf] = useState(false);

  useEffect(()=>{if(p.cat)setCat(p.cat);},[p.cat]);

  const filtered = useMemo(()=>{
    let list = P;
    if(cat!=="all") list = list.filter(x=>x.cat===cat);
    if(search.trim()){const q=search.toLowerCase();list=list.filter(x=>x.name.toLowerCase().includes(q)||x.flavor.toLowerCase().includes(q)||x.desc.toLowerCase().includes(q));}
    switch(sort){case "price-lo":return[...list].sort((a,b)=>a.price-b.price);case "price-hi":return[...list].sort((a,b)=>b.price-a.price);case "rating":return[...list].sort((a,b)=>b.rating-a.rating);case "new":return[...list].sort((a,b)=>(b.tags.includes("new")?1:0)-(a.tags.includes("new")?1:0));default:return[...list].sort((a,b)=>b.reviews-a.reviews);}
  },[cat,search,sort]);

  const sugg = useMemo(()=>(!search.trim()||search.length<2)?[]:P.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).slice(0,5),[search]);
  const ac = CATS.find(c=>c.id===cat);

  return <div style={{background:C.linen,minHeight:"80vh"}}>
    <div style={{background:`linear-gradient(168deg,${C.warm} 0%,${C.vanilla} 50%,${C.linen} 100%)`,padding:"40px 28px 30px",borderBottom:`1px solid ${C.vanilla}`}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <h1 style={{fontFamily:F.d,fontSize:"clamp(32px,4.5vw,48px)",fontWeight:500,color:C.cocoa,margin:"0 0 24px",letterSpacing:-.5}}>
          {cat==="all"?"Nuestra Colección de Pasteles":`${ac?.icon} ${ac?.name} Cakes`}
        </h1>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          <div style={{flex:"1 1 340px",position:"relative"}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.mochaL} strokeWidth="2" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",zIndex:2}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar por nombre, sabor..." value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSf(true)} onBlur={()=>setTimeout(()=>setSf(false),200)}
              style={{width:"100%",padding:"13px 14px 13px 44px",border:`1.5px solid ${sf?C.caramel:C.vanilla}`,borderRadius:R.md,fontSize:14,fontFamily:F.b,background:"#fff",color:C.cocoa,outline:"none",boxSizing:"border-box",transition:"border-color .2s,box-shadow .2s",fontWeight:400}} />
            {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.mochaL,cursor:"pointer",fontSize:16}}>{"\u00d7"}</button>}
            {sf&&sugg.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:C.white,border:`1px solid ${C.vanilla}`,borderRadius:R.md,marginTop:4,boxShadow:SH.lg,zIndex:50,overflow:"hidden",animation:"fadeSlideDown .2s ease"}}>
              {sugg.map(s=><div key={s.id} onMouseDown={e=>e.preventDefault()} onClick={()=>{setSearch(s.name);setSf(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",cursor:"pointer",borderBottom:`1px solid ${C.warm}`,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.warm} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <img src={s.img} alt="" style={{width:38,height:38,borderRadius:R.sm,objectFit:"cover"}} /><div><p style={{fontSize:13,fontWeight:600,color:C.cocoa,margin:0}}>{s.name}</p><p style={{fontSize:11.5,color:C.mochaL,margin:0}}>{s.flavor} {"\u2022"} {fmt(s.price)}</p></div>
              </div>)}
            </div>}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"13px 18px",border:`1.5px solid ${C.vanilla}`,borderRadius:R.md,fontSize:13.5,fontFamily:F.b,background:"#fff",color:C.cocoa,cursor:"pointer",outline:"none",minWidth:170,fontWeight:400}}>
            <option value="popular">Más Popular</option><option value="rating">Mejor Calificados</option><option value="price-lo">Precio: Menor {"\u2192"} High</option><option value="price-hi">Precio: Mayor {"\u2192"} Low</option><option value="new">Más Recientes</option>
          </select>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {CATS.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{padding:"10px 18px",borderRadius:R.pill,border:"none",fontFamily:F.b,fontSize:13,fontWeight:cat===c.id?600:400,background:cat===c.id?C.cocoa:C.white,color:cat===c.id?"#fff":C.mocha,cursor:"pointer",whiteSpace:"nowrap",transition:"all .25s",display:"flex",alignItems:"center",gap:5,boxShadow:cat===c.id?"none":SH.xs,letterSpacing:.2}}><span style={{fontSize:14}}>{c.icon}</span>{c.name}</button>)}
        </div>
      </div>
    </div>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 28px 72px"}}>
      <p style={{fontFamily:F.b,fontSize:14,color:C.mocha,marginBottom:22,fontWeight:400}}>Mostrando <strong style={{color:C.cocoa,fontWeight:600}}>{filtered.length}</strong>pasteles</p>
      {filtered.length>0?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))",gap:20}}>
          {filtered.map((p,i)=><Card key={p.id} product={p} index={i} onAdd={pr=>add(pr,pr.size)} />)}
        </div>
      ):(
        <div style={{textAlign:"center",padding:"72px 20px"}}>
          <p style={{fontSize:52,margin:"0 0 14px"}}>{"\uD83C\uDF70"}</p>
          <p style={{fontFamily:F.d,fontSize:22,color:C.cocoa,marginBottom:8}}>No se encontraron pasteles</p>
          <Btn v="primary" onClick={()=>{setCat("all");setSearch("");}}>Limpiar Filtros</Btn>
        </div>
      )}
    </div>
  </div>;
};

/* ═══════════════════════════════════════════════════════════════
   PRODUCT DETAIL — Premium
   ═══════════════════════════════════════════════════════════════ */
const Detail = () => {
  const {p:params,go} = useR();
  const {add} = useCart();
  const p = P.find(x=>x.id===params.id);
  const [sz,setSz] = useState(p?.size||"");
  const [qty,setQty] = useState(1);
  const [tab,setTab] = useState("desc");
  const [notes,setNotes] = useState("");

  if(!p) return <div style={{textAlign:"center",padding:80}}><p style={{fontSize:48}}>{"\uD83C\uDF82"}</p><p style={{fontFamily:F.d,fontSize:22,color:C.mocha}}>Pastel no encontrado</p><Btn onClick={()=>go("catalog")}>Volver a la Tienda</Btn></div>;

  const rel = P.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
  const cn = CATS.find(c=>c.id===p.cat)?.name;

  return <div style={{background:C.linen}}>
    <div style={{padding:"16px 28px",background:C.warm,borderBottom:`1px solid ${C.vanilla}`}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <p style={{fontFamily:F.b,fontSize:12.5,color:C.mochaL,margin:0,fontWeight:400}}>
          <span style={{cursor:"pointer"}} onClick={()=>go("home")}>Inicio</span> / <span style={{cursor:"pointer"}} onClick={()=>go("catalog")}>Tienda</span> / <span style={{cursor:"pointer"}} onClick={()=>go("catalog",{cat:p.cat})}>{cn}</span> / <span style={{color:C.cocoa,fontWeight:500}}>{p.name}</span>
        </p>
      </div>
    </div>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 28px 64px"}}>
      <div style={{display:"flex",gap:48,flexWrap:"wrap"}}>
        {/* Image */}
        <div style={{flex:"1 1 480px",minWidth:280}}>
          <div style={{borderRadius:R.xxl,overflow:"hidden",background:C.warm,position:"relative",boxShadow:SH.md}}>
            <img src={p.img} alt={p.name} style={{width:"100%",aspectRatio:"4/3",objectFit:"cover"}} />
            {p.tags[0]&&<div style={{position:"absolute",top:18,left:18}}><Badge label={BADGE_ES[p.tags[0]]||p.tags[0]} v={p.tags[0]}/></div>}
            {p.oldPrice&&<div style={{position:"absolute",top:18,right:18,background:C.rose,color:"#fff",padding:"5px 13px",borderRadius:R.pill,fontSize:11,fontWeight:700}}>-{Math.round((1-p.price/p.oldPrice)*100)}%</div>}
          </div>
        </div>

        {/* Info */}
        <div style={{flex:"1 1 440px",minWidth:300}}>
          <span style={{fontFamily:F.b,fontSize:11,fontWeight:700,color:C.caramel,textTransform:"uppercase",letterSpacing:2}}>{cn}</span>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(30px,4vw,44px)",fontWeight:500,color:C.cocoa,margin:"10px 0 14px",lineHeight:1.1,letterSpacing:-.5}}>{p.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
            <Stars r={p.rating} sz={16} num/><span style={{fontSize:13.5,color:C.mochaL,fontWeight:300}}>({p.reviews} reseñas)</span>
          </div>

          {/* Price */}
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:24,padding:"18px 22px",background:C.warm,borderRadius:R.lg}}>
            {p.oldPrice&&<span style={{fontSize:18,color:C.mochaL,textDecoration:"line-through",fontWeight:300}}>{fmt(p.oldPrice)}</span>}
            <span style={{fontFamily:F.d,fontSize:36,fontWeight:600,color:p.oldPrice?C.rose:C.cocoa}}>{fmt(p.price)}</span>
            <span style={{fontSize:14,color:C.mochaL,fontWeight:300}}>MXN</span>
            {p.oldPrice&&<span style={{background:C.roseL,color:C.rose,padding:"4px 12px",borderRadius:R.pill,fontSize:11.5,fontWeight:700}}>Ahorras {fmt(p.oldPrice-p.price)}</span>}
          </div>

          <p style={{fontFamily:F.b,fontSize:15,color:C.mocha,lineHeight:1.75,margin:"0 0 24px",fontWeight:300}}>{p.desc}</p>

          {/* Specs */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
            {[{l:"Sabor",v:p.flavor},{l:"Porciones",v:p.servings},{l:"Preparación",v:p.prep},{l:"Tamaño base",v:p.size}].map((x,i)=>(
              <div key={i} style={{background:C.warm,borderRadius:R.md,padding:"12px 16px"}}>
                <p style={{fontFamily:F.b,fontSize:10,color:C.mochaL,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>{x.l}</p>
                <p style={{fontFamily:F.b,fontSize:14,fontWeight:500,color:C.cocoa,margin:0}}>{x.v}</p>
              </div>
            ))}
          </div>

          {/* Size */}
          {p.sizes&&<div style={{marginBottom:20}}>
            <p style={{fontFamily:F.b,fontSize:12,fontWeight:700,color:C.cocoa,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:.5}}>Selecciona Tamaño</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {p.sizes.map(s=><button key={s} onClick={()=>setSz(s)} style={{padding:"11px 22px",borderRadius:R.pill,border:`2px solid ${sz===s?C.caramel:C.vanilla}`,background:sz===s?C.caramel:"#fff",color:sz===s?"#fff":C.mocha,fontFamily:F.b,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .25s cubic-bezier(.25,.1,.25,1)",transform:sz===s?"scale(1.04)":"scale(1)"}}>{s}</button>)}
            </div>
          </div>}

          {/* Notes */}
          <div style={{marginBottom:20}}>
            <p style={{fontFamily:F.b,fontSize:12,fontWeight:700,color:C.cocoa,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:.5}}>Instrucciones Especiales</p>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder={`Ej., \u201CEscribir Feliz Cumpleaños Ana\u201D`} rows={2} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${C.vanilla}`,borderRadius:R.md,fontSize:13.5,fontFamily:F.b,background:"#fff",color:C.cocoa,outline:"none",boxSizing:"border-box",resize:"vertical",fontWeight:400}} />
          </div>

          {/* Qty + Add */}
          <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",border:`2px solid ${C.vanilla}`,borderRadius:R.md,overflow:"hidden"}}>
              <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:46,height:48,border:"none",background:C.warm,cursor:"pointer",fontSize:18,color:C.cocoa,fontWeight:500}}>{"\u2212"}</button>
              <span style={{width:50,textAlign:"center",fontFamily:F.b,fontSize:17,fontWeight:700,color:C.cocoa}}>{qty}</span>
              <button onClick={()=>setQty(Math.min(20,qty+1))} style={{width:46,height:48,border:"none",background:C.warm,cursor:"pointer",fontSize:18,color:C.cocoa,fontWeight:500}}>+</button>
            </div>
            <Btn v="rose" sz="lg" style={{flex:1,minWidth:200}} onClick={()=>{add(p,sz,qty,notes);setQty(1);setNotes("");}}>
              Agregar al Carrito {"\u2014"} {fmt(p.price*qty)} MXN
            </Btn>
          </div>

          {/* Entrega */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}>
            {p.pickup&&<div style={{display:"flex",alignItems:"center",gap:7,background:C.sageL,borderRadius:R.md,padding:"9px 16px"}}><span style={{fontSize:13}}>{"\uD83C\uDFEA"}</span><span style={{fontFamily:F.b,fontSize:12.5,fontWeight:600,color:C.sage}}>Disponible para recoger</span></div>}
            {p.delivery&&<div style={{display:"flex",alignItems:"center",gap:7,background:C.sageL,borderRadius:R.md,padding:"9px 16px"}}><span style={{fontSize:13}}>{"\uD83D\uDE97"}</span><span style={{fontFamily:F.b,fontSize:12.5,fontWeight:600,color:C.sage}}>Envío en Mexicali</span></div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{marginTop:56}}>
        <div style={{display:"flex",borderBottom:`2px solid ${C.vanilla}`}}>
          {[{id:"desc",l:"Descripci\u00f3n"},{id:"ing",l:"Ingredientes"},{id:"rev",l:`Rese\u00f1as (${p.reviews})`}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"16px 30px",border:"none",background:"transparent",fontFamily:F.b,fontSize:14,fontWeight:tab===t.id?600:400,color:tab===t.id?C.caramel:C.mocha,borderBottom:tab===t.id?`3px solid ${C.caramel}`:"3px solid transparent",marginBottom:-2,cursor:"pointer",transition:"all .2s",letterSpacing:.2}}>{t.l}</button>
          ))}
        </div>
        <div style={{padding:"28px 0"}}>
          {tab==="desc"&&<p style={{fontFamily:F.b,fontSize:15,color:C.mocha,lineHeight:1.8,maxWidth:720,fontWeight:300}}>{p.desc} Elaborado diariamente en nuestra cocina de Mexicali con los ingredientes más frescos. Disponible para recoger el mismo día (si ordenas antes de las 10am) o envío al día siguiente dentro de Mexicali.</p>}
          {tab==="ing"&&<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{p.ingredients.map((ing,i)=><span key={i} style={{background:C.warm,padding:"9px 18px",borderRadius:R.pill,fontFamily:F.b,fontSize:13,color:C.mocha,fontWeight:400,border:`1px solid ${C.vanilla}`}}>{ing}</span>)}</div>}
          {tab==="rev"&&<div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:600}}>{REVIEWS.slice(0,3).map(t=><div key={t.id} style={{background:C.white,borderRadius:R.lg,padding:22,border:`1px solid ${C.vanilla}`}}><Stars r={t.rating} sz={14}/><p style={{fontFamily:F.b,fontSize:14,color:C.mocha,margin:"10px 0",lineHeight:1.6,fontStyle:"italic",fontWeight:300}}>{"\u201C"}{t.text}{"\u201D"}</p><p style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:C.cocoa,margin:0}}>{"\u2014"} {t.name}</p></div>)}</div>}
        </div>
      </div>

      {rel.length>0&&<div style={{marginTop:28}}>
        <h2 style={{fontFamily:F.d,fontSize:28,fontWeight:500,color:C.cocoa,margin:"0 0 22px"}}>También Te Puede Gustar</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))",gap:20}}>
          {rel.map((p,i)=><Card key={p.id} product={p} index={i} onAdd={pr=>add(pr,pr.size)} />)}
        </div>
      </div>}
    </div>
  </div>;
};

/* ═══════════════════════════════════════════════════════════════
   REMAINING PAGES — Cart, Checkout, Confirm, Contact, FAQ
   (Imported from previous build, applying premium tokens)
   For brevity, these use the same logic but with refined tokens.
   The full implementations are preserved from the prior version.
   ═══════════════════════════════════════════════════════════════ */

/* Minimal Cart Page — directs to drawer for now */
const CartPg = () => {
  const {items,sub,cnt,rm,setQ,setSz,setN,save,clear,disc,promo:pc,promoData:pd,promo:applyP,rmPromo} = useCart();
  const {go} = useR();
  if(!items.length) return <div style={{textAlign:"center",padding:"88px 28px",background:C.linen,minHeight:"60vh"}}><div style={{width:80,height:80,borderRadius:"50%",background:C.warm,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px",fontSize:36}}>{"\uD83D\uDED2"}</div><h2 style={{fontFamily:F.d,fontSize:32,fontWeight:500,color:C.cocoa,margin:"0 0 10px"}}>Tu carrito está vacío</h2><p style={{fontFamily:F.b,fontSize:16,color:C.mocha,margin:"0 0 24px",fontWeight:300}}>Explora nuestra colección y agrega tus favoritos</p><Btn v="primary" sz="lg" onClick={()=>go("catalog")}>Ver Pasteles</Btn></div>;

  return <div style={{background:C.linen,minHeight:"70vh"}}>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 28px 80px"}}>
      <h1 style={{fontFamily:F.d,fontSize:"clamp(30px,4vw,42px)",fontWeight:500,color:C.cocoa,margin:"0 0 28px"}}>Tu Carrito <span style={{fontFamily:F.b,fontSize:16,fontWeight:400,color:C.mochaL}}>({cnt} art\u00edculos)</span></h1>
      <div style={{display:"flex",gap:36,flexWrap:"wrap",alignItems:"flex-start"}}>
        <div style={{flex:"1 1 540px",minWidth:300,display:"flex",flexDirection:"column",gap:14}}>
          {items.map((it,idx)=>{const pr=P.find(x=>x.id===it.pid);return(
            <div key={it.cid} style={{background:C.white,borderRadius:R.xl,padding:22,border:`1px solid ${C.vanilla}`,animation:"fadeSlideUp .4s ease both",animationDelay:`${idx*60}ms`}}>
              <div style={{display:"flex",gap:18}}>
                <img src={it.img} alt={it.name} onClick={()=>go("product",{id:it.pid})} style={{width:100,height:100,borderRadius:R.lg,objectFit:"cover",flexShrink:0,cursor:"pointer"}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                    <h3 onClick={()=>go("product",{id:it.pid})} style={{fontFamily:F.d,fontSize:19,fontWeight:500,color:C.cocoa,margin:"0 0 4px",cursor:"pointer"}}>{it.name}</h3>
                    <p style={{fontFamily:F.b,fontSize:18,fontWeight:700,color:C.cocoa,margin:0,flexShrink:0}}>{fmt(it.price*it.qty)}</p>
                  </div>
                  <p style={{fontFamily:F.b,fontSize:13,color:C.mochaL,margin:"0 0 10px",fontWeight:300}}>{fmt(it.price)} MXN c/u</p>
                  {pr?.sizes&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                    <span style={{fontFamily:F.b,fontSize:11.5,color:C.mocha,fontWeight:600}}>Tamaño:</span>
                    {pr.sizes.map(s=><button key={s} onClick={()=>setSz(it.cid,s)} style={{padding:"4px 13px",borderRadius:R.pill,border:`1.5px solid ${it.size===s?C.caramel:C.vanilla}`,background:it.size===s?C.caramel:"transparent",color:it.size===s?"#fff":C.mocha,fontSize:11.5,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>{s}</button>)}
                  </div>}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",border:`1.5px solid ${C.vanilla}`,borderRadius:R.md,overflow:"hidden"}}>
                      <button onClick={()=>setQ(it.cid,it.qty-1)} style={{width:34,height:34,border:"none",background:C.warm,cursor:"pointer",fontSize:15,color:C.cocoa}}>{"\u2212"}</button>
                      <span style={{width:38,textAlign:"center",fontSize:14,fontWeight:700,color:C.cocoa}}>{it.qty}</span>
                      <button onClick={()=>setQ(it.cid,it.qty+1)} style={{width:34,height:34,border:"none",background:C.warm,cursor:"pointer",fontSize:15,color:C.cocoa}}>+</button>
                    </div>
                    <div style={{display:"flex",gap:14}}>
                      <button onClick={()=>save(it.cid)} style={{fontFamily:F.b,fontSize:12,color:C.mocha,background:"none",border:"none",cursor:"pointer",fontWeight:400}}>Guardar para después</button>
                      <button onClick={()=>rm(it.cid)} style={{fontFamily:F.b,fontSize:12,color:C.rose,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );})}
          <button onClick={clear} style={{fontFamily:F.b,fontSize:12.5,color:C.mochaL,background:"none",border:"none",cursor:"pointer",marginTop:4,textAlign:"left",fontWeight:400}}>Vaciar carrito</button>
        </div>
        <div style={{flex:"0 0 340px",minWidth:280,position:"sticky",top:92}}>
          <div style={{background:C.white,borderRadius:R.xl,padding:26,border:`1px solid ${C.vanilla}`,boxShadow:SH.sm}}>
            <h3 style={{fontFamily:F.d,fontSize:22,fontWeight:500,color:C.cocoa,margin:"0 0 20px"}}>Resumen del Pedido</h3>
            <div style={{display:"flex",flexDirection:"column",gap:7,fontFamily:F.b,fontSize:14,color:C.mocha,fontWeight:400}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Subtotal</span><span>{fmt(sub)} MXN</span></div>
              {disc>0&&<div style={{display:"flex",justifyContent:"space-between",color:C.sage}}><span>Descuento</span><span>-{fmt(disc)}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Envío</span><span style={{color:C.mochaL}}>En el pago</span></div>
              <div style={{borderTop:`1.5px solid ${C.vanilla}`,paddingTop:12,marginTop:6,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:21,color:C.cocoa}}><span>Total</span><span>{fmt(sub-disc)} MXN</span></div>
            </div>
            <Btn v="dark" sz="lg" style={{width:"100%",marginTop:20}} onClick={()=>go("checkout")}>Ir a Pagar</Btn>
            <Btn v="ghost" sz="md" style={{width:"100%",marginTop:8}} onClick={()=>go("catalog")}>Seguir Comprando</Btn>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

/* Simplified checkout & confirmation for the refined build */
const CheckoutPg = () => {
  const {items,sub,clear,disc} = useCart();
  const {go} = useR();
  const [step,setStep] = useState(1);
  const [method,setMethod] = useState("pickup");
  const [pay,setPay] = useState("card");
  const [proc,setProc] = useState(false);
  const [f,setF] = useState({name:"",phone:"",email:"",street:"",colony:"",zip:"",pickupDate:"",pickupTime:"14:00",cardName:"",cardNum:"",cardExp:"",cardCvv:""});
  const [err,setErr] = useState({});
  const fee = method==="delivery"?80:0;
  const total = sub-disc+fee;
  const up = (k,v)=>{setF(o=>({...o,[k]:v}));setErr(o=>({...o,[k]:undefined}));};
  const inpS = k=>({width:"100%",padding:"12px 14px",border:`1.5px solid ${err[k]?C.rose:C.vanilla}`,borderRadius:R.md,fontSize:14,fontFamily:F.b,background:"#fff",color:C.cocoa,outline:"none",boxSizing:"border-box",fontWeight:400});
  const labS = {fontFamily:F.b,fontSize:12,color:C.mocha,display:"block",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:.5};

  if(!items.length) return <div style={{textAlign:"center",padding:"88px 28px",background:C.linen,minHeight:"60vh"}}><p style={{fontSize:56}}>{"\uD83D\uDED2"}</p><h2 style={{fontFamily:F.d,fontSize:30,color:C.cocoa}}>Tu carrito está vacío</h2><Btn v="primary" sz="lg" onClick={()=>go("catalog")} style={{marginTop:16}}>Ver Pasteles</Btn></div>;

  const v1=()=>{const e={};if(!f.name.trim())e.name="Requerido";if(!f.phone.trim())e.phone="Requerido";if(method==="delivery"){if(!f.street.trim())e.street="Requerido";if(!f.colony.trim())e.colony="Requerido";if(!f.zip.trim())e.zip="Requerido";else{const z=parseInt(f.zip);if(z<21000||z>21960)e.zip="C.P. Mexicali: 21000\u201321960";}}else{if(!f.pickupDate)e.pickupDate="Requerido";}setErr(e);return!Object.keys(e).length;};
  const submit=()=>{if(pay==="card"){const e={};if(!f.cardName.trim())e.cardName="Requerido";if(f.cardNum.replace(/\D/g,"").length<16)e.cardNum="16 dígitos";if(!f.cardExp.trim())e.cardExp="Requerido";if(f.cardCvv.length<3)e.cardCvv="Requerido";setErr(e);if(Object.keys(e).length)return;}setProc(true);setTimeout(()=>{clear();go("confirm",{orderId:orderId(),total,method,pay,items:[...items],name:f.name});},3200);};

  return <div style={{background:C.linen,minHeight:"80vh"}}>
    {proc&&<div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(42,24,16,.92)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s ease"}}><div style={{textAlign:"center",padding:32}}><div style={{width:80,height:80,margin:"0 auto 28px",position:"relative"}}><div style={{position:"absolute",inset:0,borderRadius:"50%",border:`3px solid rgba(190,142,104,.2)`}}/><div style={{position:"absolute",inset:0,borderRadius:"50%",border:"3px solid transparent",borderTopColor:C.caramel,animation:"spin 1s linear infinite"}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{"\uD83D\uDD12"}</div></div><p style={{fontFamily:F.b,fontSize:17,fontWeight:600,color:"#fff",margin:"0 0 8px"}}>Procesando tu pago...</p><p style={{fontFamily:F.b,fontSize:14,color:C.caramelL,margin:"0 0 28px"}}>{fmt(total)} MXN</p><p style={{fontFamily:F.b,fontSize:11,color:"rgba(255,255,255,.35)"}}>MODO SIMULACIÓN {"\u2014"} Sin cargos reales</p></div></div>}
    <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 28px 72px"}}>
      <h1 style={{fontFamily:F.d,fontSize:"clamp(30px,4vw,42px)",fontWeight:500,color:C.cocoa,margin:"0 0 28px"}}>Pagar</h1>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:28,flexWrap:"wrap"}}>
        {["Entrega","Revisar","Pago"].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:step>i+1?C.sage:step===i+1?C.caramel:C.vanilla,color:step>=i+1?"#fff":C.mocha,fontSize:12.5,fontWeight:700,transition:"all .3s"}}>{step>i+1?"\u2713":i+1}</div><span style={{fontFamily:F.b,fontSize:13.5,fontWeight:step===i+1?600:400,color:step===i+1?C.cocoa:C.mochaL}}>{s}</span>{i<2&&<span style={{color:C.vanilla,margin:"0 4px"}}>{"\u2014"}</span>}</div>)}
      </div>
      <div style={{display:"flex",gap:36,flexWrap:"wrap",alignItems:"flex-start"}}>
        <div style={{flex:"1 1 520px",minWidth:300}}>
          {step===1&&<div style={{background:C.white,borderRadius:R.xl,padding:28,border:`1px solid ${C.vanilla}`,animation:"fadeSlideUp .35s ease"}}>
            <h2 style={{fontFamily:F.d,fontSize:22,fontWeight:500,color:C.cocoa,margin:"0 0 20px"}}>Entrega</h2>
            <div style={{display:"flex",gap:10,marginBottom:24}}>{[{id:"pickup",i:"\uD83C\uDFEA",l:"Recoger en Tienda",s:"Gratis"},{id:"delivery",i:"\uD83D\uDE97",l:"Envío a Domicilio",s:"$80 MXN"}].map(m=><button key={m.id} onClick={()=>setMethod(m.id)} style={{flex:1,padding:"18px 16px",borderRadius:R.lg,cursor:"pointer",border:`2px solid ${method===m.id?C.caramel:C.vanilla}`,background:method===m.id?`${C.caramel}08`:"#fff",textAlign:"center"}}><span style={{fontSize:22,display:"block",marginBottom:4}}>{m.i}</span><span style={{fontFamily:F.b,fontSize:13,fontWeight:700,color:C.cocoa,display:"block"}}>{m.l}</span><span style={{fontFamily:F.b,fontSize:12,color:C.mochaL}}>{m.s}</span></button>)}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}><div><label style={labS}>Nombre completo</label><input value={f.name} onChange={e=>up("name",e.target.value)} style={inpS("name")} placeholder="Ana Garc\u00eda"/>{err.name&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.name}</p>}</div><div><label style={labS}>Teléfono</label><input value={f.phone} onChange={e=>up("phone",e.target.value)} style={inpS("phone")} placeholder="(686) 555-1234"/>{err.phone&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.phone}</p>}</div></div>
            <div style={{marginBottom:18}}><label style={labS}>Correo</label><input value={f.email} onChange={e=>up("email",e.target.value)} style={inpS("email")} placeholder="ana@correo.com"/></div>
            {method==="pickup"?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}><div><label style={labS}>Fecha</label><input type="date" value={f.pickupDate} onChange={e=>up("pickupDate",e.target.value)} style={inpS("pickupDate")}/>{err.pickupDate&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.pickupDate}</p>}</div><div><label style={labS}>Hora</label><select value={f.pickupTime} onChange={e=>up("pickupTime",e.target.value)} style={{...inpS("pickupTime"),cursor:"pointer"}}><option value="10:00">10 AM</option><option value="12:00">12 PM</option><option value="14:00">2 PM</option><option value="16:00">4 PM</option><option value="18:00">6 PM</option></select></div></div>:<div><div style={{marginBottom:12}}><label style={labS}>Calle</label><input value={f.street} onChange={e=>up("street",e.target.value)} style={inpS("street")} placeholder="Av. Reforma 1200"/>{err.street&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.street}</p>}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}><div><label style={labS}>Colonia</label><input value={f.colony} onChange={e=>up("colony",e.target.value)} style={inpS("colony")}/>{err.colony&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.colony}</p>}</div><div><label style={labS}>C.P.</label><input value={f.zip} onChange={e=>up("zip",e.target.value)} style={inpS("zip")} placeholder="21000"/>{err.zip&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.zip}</p>}</div></div></div>}
            <Btn v="primary" sz="lg" style={{width:"100%",marginTop:20}} onClick={()=>{if(v1())setStep(2);}}>Continuar a Revisar</Btn>
          </div>}
          {step===2&&<div style={{background:C.white,borderRadius:R.xl,padding:28,border:`1px solid ${C.vanilla}`,animation:"fadeSlideUp .35s ease"}}>
            <h2 style={{fontFamily:F.d,fontSize:22,fontWeight:500,color:C.cocoa,margin:"0 0 20px"}}>Revisar Pedido</h2>
            <div style={{marginBottom:16,padding:16,background:C.warm,borderRadius:R.lg}}><p style={{fontFamily:F.b,fontSize:14,fontWeight:600,color:C.cocoa,margin:"0 0 3px"}}>{method==="pickup"?"Recoger en Tienda":"Envío a Domicilio"}</p><p style={{fontFamily:F.b,fontSize:13,color:C.mocha,margin:0,fontWeight:300}}>{method==="pickup"?`${f.pickupDate} a las ${f.pickupTime}`:`${f.street}, ${f.colony}, Mexicali ${f.zip}`}</p><p style={{fontFamily:F.b,fontSize:12.5,color:C.mochaL,margin:"2px 0 0",fontWeight:300}}>{f.name} {"\u2022"} {f.phone}</p></div>
            {items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<items.length-1?`1px solid ${C.vanilla}`:"none"}}><img src={it.img} alt="" style={{width:48,height:48,borderRadius:R.md,objectFit:"cover"}}/><div style={{flex:1}}><p style={{fontFamily:F.b,fontSize:14,fontWeight:500,color:C.cocoa,margin:0}}>{it.name}</p><p style={{fontFamily:F.b,fontSize:12,color:C.mochaL,margin:"2px 0 0",fontWeight:300}}>{"\u00d7"}{it.qty} {"\u2022"} {it.size}</p></div><span style={{fontFamily:F.b,fontSize:14,fontWeight:700,color:C.cocoa}}>{fmt(it.price*it.qty)}</span></div>)}
            <div style={{display:"flex",gap:12,marginTop:22}}><Btn v="ghost" onClick={()=>setStep(1)}>{"\u2190"} Atrás</Btn><Btn v="primary" sz="lg" style={{flex:1}} onClick={()=>setStep(3)}>Continuar a Pago</Btn></div>
          </div>}
          {step===3&&<div style={{background:C.white,borderRadius:R.xl,padding:28,border:`1px solid ${C.vanilla}`,animation:"fadeSlideUp .35s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><h2 style={{fontFamily:F.d,fontSize:22,fontWeight:500,color:C.cocoa,margin:0}}>Pago</h2><span style={{fontFamily:F.b,fontSize:12,color:C.sage,fontWeight:600}}>{"\uD83D\uDD12"} Pago Seguro</span></div>
            <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>{[{id:"card",i:"\uD83D\uDCB3",l:"Tarjeta"},{id:"oxxo",i:"\uD83C\uDFEA",l:"OXXO"},...(method==="pickup"?[{id:"cash",i:"\uD83D\uDCB5",l:"Efectivo"}]:[])].map(m=><button key={m.id} onClick={()=>setPay(m.id)} style={{flex:"1 1 100px",padding:"14px",borderRadius:R.lg,cursor:"pointer",border:`2px solid ${pay===m.id?C.caramel:C.vanilla}`,background:pay===m.id?`${C.caramel}08`:"#fff",textAlign:"center"}}><span style={{fontSize:20,display:"block",marginBottom:4}}>{m.i}</span><span style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:C.cocoa}}>{m.l}</span></button>)}</div>
            {pay==="card"&&<div style={{display:"flex",flexDirection:"column",gap:12,animation:"fadeSlideUp .25s ease"}}>
              <div><label style={labS}>Titular de la tarjeta</label><input value={f.cardName} onChange={e=>up("cardName",e.target.value.toUpperCase())} style={inpS("cardName")} placeholder="ANA GARC\u00cdA"/>{err.cardName&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.cardName}</p>}</div>
              <div><label style={labS}>Número de tarjeta</label><input value={f.cardNum} onChange={e=>{const n=e.target.value.replace(/\D/g,"").slice(0,16);up("cardNum",n.replace(/(\d{4})(?=\d)/g,"$1 "));}} style={inpS("cardNum")} placeholder="4242 4242 4242 4242" inputMode="numeric"/>{err.cardNum&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.cardNum}</p>}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={labS}>Vencimiento</label><input value={f.cardExp} onChange={e=>{const n=e.target.value.replace(/\D/g,"").slice(0,4);up("cardExp",n.length>=3?n.slice(0,2)+"/"+n.slice(2):n);}} style={inpS("cardExp")} placeholder="MM/YY" maxLength={5}/>{err.cardExp&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.cardExp}</p>}</div>
                <div><label style={labS}>CVV</label><input type="password" value={f.cardCvv} onChange={e=>up("cardCvv",e.target.value.replace(/\D/g,"").slice(0,4))} style={inpS("cardCvv")} placeholder={"\u2022\u2022\u2022"}/>{err.cardCvv&&<p style={{fontSize:11,color:C.rose,marginTop:3}}>{err.cardCvv}</p>}</div>
              </div>
            </div>}
            {pay==="oxxo"&&<div style={{background:C.goldL,borderRadius:R.lg,padding:20,animation:"fadeSlideUp .25s ease"}}><p style={{fontFamily:F.b,fontSize:14,fontWeight:600,color:C.cocoa,margin:"0 0 8px"}}>{"\uD83C\uDFEA"} Pago en OXXO</p><p style={{fontFamily:F.b,fontSize:13,color:C.mocha,lineHeight:1.6,margin:0,fontWeight:300}}>Se generará una referencia de pago. Visita cualquier OXXO en las próximas 48 horas y paga {fmt(total)} MXN.</p></div>}
            {pay==="cash"&&<div style={{background:C.sageL,borderRadius:R.lg,padding:20,animation:"fadeSlideUp .25s ease"}}><p style={{fontFamily:F.b,fontSize:14,fontWeight:600,color:C.cocoa,margin:"0 0 8px"}}>{"\uD83D\uDCB5"} Efectivo al Recoger</p><p style={{fontFamily:F.b,fontSize:13,color:C.mocha,lineHeight:1.6,margin:0,fontWeight:300}}>Pagar {fmt(total)} MXN al recoger tu pedido. Por favor trae el cambio exacto de ser posible.</p></div>}
            <div style={{display:"flex",gap:12,marginTop:22}}><Btn v="ghost" onClick={()=>setStep(2)}>{"\u2190"} Atrás</Btn><Btn v="dark" sz="lg" style={{flex:1}} onClick={submit} disabled={proc}>{pay==="card"?`Pagar ${fmt(total)} MXN`:pay==="oxxo"?"Generar Referencia OXXO":"Confirmar Pedido"}</Btn></div>
            <p style={{fontFamily:F.b,fontSize:11,color:C.mochaL,textAlign:"center",marginTop:10,fontStyle:"italic",fontWeight:300}}>Pago simulado {"\u2014"} sin cargos reales</p>
          </div>}
        </div>
        <div style={{flex:"0 0 320px",minWidth:270,position:"sticky",top:92}}>
          <div style={{background:C.white,borderRadius:R.xl,padding:24,border:`1px solid ${C.vanilla}`,boxShadow:SH.sm}}>
            <h3 style={{fontFamily:F.d,fontSize:20,fontWeight:500,color:C.cocoa,margin:"0 0 16px"}}>Resumen</h3>
            {items.map((it,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}><img src={it.img} alt="" style={{width:40,height:40,borderRadius:R.sm,objectFit:"cover"}}/><div style={{flex:1,minWidth:0}}><p style={{fontSize:12.5,color:C.cocoa,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{it.name}</p><p style={{fontSize:11,color:C.mochaL,margin:0,fontWeight:300}}>{"\u00d7"}{it.qty}</p></div><span style={{fontSize:12.5,fontWeight:700,color:C.cocoa}}>{fmt(it.price*it.qty)}</span></div>)}
            <div style={{borderTop:`1px solid ${C.vanilla}`,marginTop:10,paddingTop:10,display:"flex",flexDirection:"column",gap:6,fontSize:14,color:C.mocha,fontWeight:400}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Subtotal</span><span>{fmt(sub)}</span></div>
              {disc>0&&<div style={{display:"flex",justifyContent:"space-between",color:C.sage}}><span>Descuento</span><span>-{fmt(disc)}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Envío</span><span>{fee>0?fmt(fee):"Gratis"}</span></div>
              <div style={{borderTop:`1.5px solid ${C.vanilla}`,paddingTop:10,marginTop:4,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:20,color:C.cocoa}}><span>Total</span><span>{fmt(total)} MXN</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

const ConfirmPg = () => {
  const {p,go} = useR();
  const [conf,setConf] = useState(true);
  useEffect(()=>{setTimeout(()=>setConf(false),4000);},[]);
  return <div style={{background:C.linen,minHeight:"80vh",padding:"48px 28px 72px",position:"relative",overflow:"hidden"}}>
    {conf&&<div style={{position:"absolute",inset:0,pointerEvents:"none"}}>{Array.from({length:40},(_,i)=><div key={i} style={{position:"absolute",width:5+Math.random()*8,height:5+Math.random()*8,background:[C.caramel,C.rose,C.sage,C.gold,C.vanilla,"#E8A5D0"][i%6],borderRadius:i%3===0?"50%":i%3===1?"2px":"0",left:`${Math.round(Math.random()*100)}%`,top:-10,animation:`confettiFall ${2.5+Math.random()*2}s ease-in forwards`,animationDelay:`${Math.random()*1.5}s`,transform:`rotate(${Math.round(Math.random()*360)}deg)`}}/>)}</div>}
    <div style={{maxWidth:620,margin:"0 auto",textAlign:"center"}}>
      <div style={{width:84,height:84,borderRadius:"50%",background:`linear-gradient(135deg,${C.sage},${C.sageD})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",animation:"popIn .6s cubic-bezier(.175,.885,.32,1.275)"}}><span style={{fontSize:38,color:"#fff"}}>{"\u2713"}</span></div>
      <h1 style={{fontFamily:F.d,fontSize:"clamp(30px,5vw,46px)",fontWeight:500,color:C.cocoa,margin:"0 0 10px"}}>¡Pedido Confirmado!</h1>
      <p style={{fontFamily:F.b,fontSize:16,color:C.mocha,margin:"0 0 32px",fontWeight:300}}>Gracias{p.name?`, ${p.name.split(" ")[0]}`:""}, por elegir Rising Cakes</p>
      <div style={{background:C.white,borderRadius:R.xxl,overflow:"hidden",border:`1px solid ${C.vanilla}`,boxShadow:SH.md,marginBottom:28,textAlign:"left"}}>
        <div style={{background:`linear-gradient(135deg,${C.cocoa},${C.cocoaL})`,padding:"24px 28px",color:"#fff"}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:1,opacity:.6,margin:"0 0 4px"}}>Número de Pedido</p><p style={{fontSize:22,fontWeight:700,margin:0,letterSpacing:.5,fontFamily:F.b}}>{p.orderId||"RC-XXXXXXXX"}</p></div>
            <div style={{textAlign:"right"}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:1,opacity:.6,margin:"0 0 4px"}}>Total</p><p style={{fontSize:22,fontWeight:700,margin:0,fontFamily:F.b}}>{fmt(p.total||0)} <span style={{fontSize:13,opacity:.6}}>MXN</span></p></div>
          </div>
        </div>
        <div style={{padding:"24px 28px"}}>
          <div style={{background:C.sageL,borderRadius:R.lg,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>{p.pay==="card"?"\uD83D\uDCB3":p.pay==="oxxo"?"\uD83C\uDFEA":"\uD83D\uDCB5"}</span>
            <p style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:C.sage,margin:0}}>Pago {p.pay==="oxxo"?"referencia generada":"exitoso"}</p>
          </div>
          <div style={{background:C.warm,borderRadius:R.lg,padding:"14px 18px"}}>
            <p style={{fontFamily:F.b,fontSize:14,fontWeight:600,color:C.cocoa,margin:"0 0 3px"}}>{p.method==="delivery"?"\uD83D\uDE97 Env\u00edo a Domicilio":"\uD83C\uDFEA Recoger en Tienda"}</p>
            <p style={{fontFamily:F.b,fontSize:13,color:C.mocha,margin:0,fontWeight:300}}>{p.method==="delivery"?"Ma\u00f1ana, 2\u20134 PM \u2022 Mexicali":"Blvd. L\u00e1zaro C\u00e1rdenas 500"}</p>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn v="primary" sz="lg" onClick={()=>go("catalog")}>Seguir Comprando</Btn>
        <Btn v="whatsapp" sz="lg">Compartir por WhatsApp</Btn>
      </div>
    </div>
  </div>;
};

const ContactPg = () => {
  const [sent,setSent] = useState(false);
  return <div style={{background:C.linen,minHeight:"70vh"}}><div style={{maxWidth:1200,margin:"0 auto",padding:"52px 28px 72px"}}>
    <SectionDivider />
    <h1 style={{fontFamily:F.d,fontSize:"clamp(30px,4.5vw,46px)",fontWeight:500,color:C.cocoa,margin:"12px 0 40px",textAlign:"center"}}>Contáctanos</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:28}}>
      <div style={{background:C.white,borderRadius:R.xl,padding:28,border:`1px solid ${C.vanilla}`}}>
        <h3 style={{fontFamily:F.d,fontSize:22,fontWeight:500,color:C.cocoa,margin:"0 0 20px"}}>Nuestra Tienda</h3>
        {[{i:"\uD83D\uDCCD",l:"Dirección",v:"Blvd. L\u00e1zaro C\u00e1rdenas 500\nMexicali, BC 21100"},{i:"\uD83D\uDCDE",l:"Teléfono",v:"+52 (686) 555-1234"},{i:"\uD83D\uDD50",l:"Horario",v:"Lun\u2013Sáb: 9:00 AM \u2013 8:00 PM"},{i:"\uD83D\uDCE7",l:"Correo",v:"hello@risingcakes.mx"}].map((x,i)=><div key={i} style={{display:"flex",gap:14,marginBottom:16}}><span style={{fontSize:17}}>{x.i}</span><div><p style={{fontFamily:F.b,fontSize:10.5,color:C.mochaL,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>{x.l}</p><p style={{fontFamily:F.b,fontSize:14,color:C.cocoa,margin:0,whiteSpace:"pre-line",fontWeight:400}}>{x.v}</p></div></div>)}
      </div>
      <div style={{background:C.white,borderRadius:R.xl,padding:28,border:`1px solid ${C.vanilla}`}}>
        {sent?<div style={{textAlign:"center",padding:36}}><p style={{fontSize:40,margin:"0 0 12px"}}>{"\u2709\uFE0F"}</p><p style={{fontFamily:F.d,fontSize:22,color:C.sage}}>¡Mensaje enviado!</p><p style={{fontFamily:F.b,fontSize:14,color:C.mocha,fontWeight:300}}>Responderemos en las próximas 24 horas.</p></div>:
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <h3 style={{fontFamily:F.d,fontSize:22,fontWeight:500,color:C.cocoa,margin:"0 0 8px"}}>Envía un Mensaje</h3>
          {["Tu nombre","Correo electrónico","Teléfono"].map(ph=><input key={ph} placeholder={ph} style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${C.vanilla}`,borderRadius:R.md,fontSize:14,fontFamily:F.b,background:"#fff",boxSizing:"border-box",outline:"none",fontWeight:400}}/>)}
          <textarea placeholder="Tu mensaje..." rows={4} style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${C.vanilla}`,borderRadius:R.md,fontSize:14,fontFamily:F.b,background:"#fff",boxSizing:"border-box",outline:"none",resize:"vertical",fontWeight:400}}/>
          <Btn v="primary" sz="lg" style={{width:"100%"}} onClick={()=>setSent(true)}>Enviar Mensaje</Btn>
        </div>}
      </div>
    </div>
  </div></div>;
};

const FaqPg = () => {
  const [open,setOpen] = useState(0);
  return <div style={{background:C.linen,minHeight:"70vh"}}><div style={{maxWidth:720,margin:"0 auto",padding:"52px 28px 72px"}}>
    <SectionDivider />
    <h1 style={{fontFamily:F.d,fontSize:"clamp(30px,4.5vw,46px)",fontWeight:500,color:C.cocoa,margin:"12px 0 40px",textAlign:"center"}}>Preguntas Frecuentes</h1>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {FAQ_DATA.map((x,i)=><div key={i} style={{background:C.white,borderRadius:R.xl,border:`1px solid ${C.vanilla}`,overflow:"hidden",transition:"box-shadow .2s",boxShadow:open===i?SH.sm:"none"}}>
        <button onClick={()=>setOpen(open===i?-1:i)} style={{width:"100%",padding:"20px 26px",border:"none",background:"transparent",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",fontFamily:F.b,fontSize:15,fontWeight:600,color:C.cocoa,textAlign:"left",letterSpacing:.2}}>
          <span>{x.q}</span><span style={{fontSize:18,color:C.caramel,transform:open===i?"rotate(180deg)":"rotate(0)",transition:"transform .25s",flexShrink:0,marginLeft:14}}>{"\u25BE"}</span>
        </button>
        {open===i&&<div style={{padding:"0 26px 20px",animation:"fadeSlideUp .2s ease"}}><p style={{fontFamily:F.b,fontSize:14,color:C.mocha,margin:0,lineHeight:1.75,fontWeight:300}}>{x.a}</p></div>}
      </div>)}
    </div>
  </div></div>;
};

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════════════ */
const Router = () => {
  const {pg} = useR();
  const map = {home:Home,catalog:Catalog,product:Detail,cart:CartPg,checkout:CheckoutPg,confirm:ConfirmPg,contact:ContactPg,faq:FaqPg};
  const Page = map[pg]||Home;
  return <Page/>;
};

export default function App() {
  return <RP><CartProv>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Dancing+Script:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      html{scroll-behavior:smooth}
      body{font-family:'Outfit',-apple-system,sans-serif;background:#FAF7F3;color:#2A1810;-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden}
      ::selection{background:#E8D0B4;color:#2A1810}
      img{display:block;max-width:100%}
      button{font-family:inherit;cursor:pointer}
      input:focus,select:focus,textarea:focus{border-color:#BE8E68!important;box-shadow:0 0 0 3px rgba(190,142,104,.12);outline:none}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes fadeSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeSlideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
      @keyframes popIn{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes scaleIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
      @media(max-width:768px){.desk-nav{display:none!important}.mob-btn{display:block!important}.mobile-cart-bar{display:flex!important}}
      @media(min-width:769px){.mob-btn{display:none!important}.mobile-cart-bar{display:none!important}}
      ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#F3EBE1}::-webkit-scrollbar-thumb{background:#E4D1BC;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:#D2AA84}
    `}</style>
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Nav/>
      <main style={{flex:1}}><Router/></main>
      <Foot/>
      <Drawer/>
      <Toast/>
      <MobBar/>
    </div>
  </CartProv></RP>;
}
