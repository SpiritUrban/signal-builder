import companyProfile from "./companyProfile.json";

export interface CompanyInfoBlock {
  id: string;
  title: string;
  hint: string;
  content: string;
  type?: "text" | "list" | "keywords";
  featured?: boolean;
}

const lines = (items: string[]) => items.join("\n");

export const companyInfoBlocks: CompanyInfoBlock[] = [
  {
    id: "activity",
    title: "Напрям діяльності",
    hint: "Business category / Activity",
    content: "Індивідуальні пасажирські перевезення та трансфери між містами Польщі, аеропортами, вокзалами та прикордонними пунктами.",
    featured: true,
  },
  {
    id: "specialization",
    title: "Основна спеціалізація",
    hint: "Specialization / Services overview",
    content: "Комфортні індивідуальні трансфери для пасажирів, які подорожують між Україною та Польщею або пересуваються територією Польщі та Європи.",
    featured: true,
  },
  {
    id: "short-description",
    title: "Короткий опис",
    hint: "100–150 символів · профілі та каталоги",
    content: "My Transfer — індивідуальні трансфери між містами Польщі, аеропортами та кордоном. Комфортні авто, без пересадок, 24/7.",
    featured: true,
  },
  {
    id: "medium-description",
    title: "Середній опис",
    hint: "300–500 символів · оголошення та business pages",
    content: "My Transfer — сервіс індивідуальних пасажирських перевезень у Польщі та Європі. Компанія спеціалізується на трансферах між Хелмом, Варшавою, Любліном, Перемишлем, Краковом, а також аеропортами Шопена та Модлін. Пасажири отримують комфортну поїздку без пересадок, допомогу з багажем та можливість замовити дитяче крісло.",
    featured: true,
  },
  {
    id: "full-description",
    title: "Повний опис",
    hint: "About / Детальний опис компанії",
    content: "My Transfer надає послуги індивідуальних трансферів для пасажирів, які цінують комфорт, пунктуальність та безпечні перевезення. Компанія працює на популярних маршрутах між містами Польщі, аеропортами, залізничними вокзалами та прикордонними переходами. Особливо популярними є напрямки Хелм — Варшава, Хелм — Аеропорт Шопена та Хелм — Аеропорт Модлін. Для поїздок використовуються комфортні автомобілі Mercedes-Benz та Lexus. Послуги доступні цілодобово, включаючи зустріч пасажирів після прибуття поїздом або літаком.",
    featured: true,
  },
  {
    id: "routes",
    title: "Основні маршрути",
    hint: "Routes / Service areas",
    type: "list",
    content: lines(["Хелм — Варшава", "Варшава — Хелм", "Хелм — Аеропорт Шопена", "Аеропорт Шопена — Хелм", "Хелм — Аеропорт Модлін", "Аеропорт Модлін — Хелм", "Хелм — Люблін", "Люблін — Хелм", "Хелм — Перемишль", "Перемишль — Хелм", "Хелм — Медика", "Медика — Хелм", "Краків — Хелм", "Хелм — Краків"]),
  },
  {
    id: "international",
    title: "Міжнародні напрямки",
    hint: "International destinations",
    type: "list",
    content: lines(["Берлін", "Прага", "Братислава", "Будапешт", "Відень", "Амстердам", "Париж", "Мюнхен", "Франкфурт", "Дрезден", "Дортмунд", "Афіни", "Мадрид", "Лісабон", "Кишинів"]),
  },
  {
    id: "audience",
    title: "Для кого послуга",
    hint: "Target audience / Customer types",
    type: "list",
    content: lines(companyProfile.targetAudience),
  },
  {
    id: "advantages",
    title: "Переваги",
    hint: "Benefits / Highlights",
    type: "list",
    content: lines(companyProfile.benefits),
  },
  {
    id: "fleet",
    title: "Автопарк",
    hint: "Fleet / Vehicles",
    type: "list",
    content: lines([
      ...companyProfile.fleet.businessSedans.map((car) => `${car.name} — ${car.passengers} пас., ${car.luggage} місць багажу`),
      ...companyProfile.fleet.premiumMinivans.map((car) => `${car.name} — ${car.passengers} пас., ${car.luggage} місць багажу`),
      ...companyProfile.fleet.groupTransfers.map((car) => `${car.name} — ${car.passengers} пас., ${car.luggage} місць багажу`),
    ]),
  },
  {
    id: "additional-services",
    title: "Додаткові послуги",
    hint: "Additional services",
    type: "list",
    content: lines(companyProfile.additionalServices.map((service) => `${service.name} — ${service.description}`)),
  },
  {
    id: "keywords",
    title: "Ключові слова",
    hint: "SEO keywords / Tags",
    type: "keywords",
    content: lines(companyProfile.seoKeywords),
    featured: true,
  },
  {
    id: "partner-types",
    title: "Партнерська програма",
    hint: "Partner types",
    type: "list",
    content: lines(companyProfile.partnerProgram.partnerTypes),
  },
  {
    id: "cooperation-formats",
    title: "Формати співпраці",
    hint: "Cooperation formats",
    type: "list",
    content: lines(companyProfile.partnerProgram.cooperationFormats),
  },
  {
    id: "best-for",
    title: "Ідеально підходить для",
    hint: "Best for / Use cases",
    type: "list",
    content: lines(companyProfile.bestFor),
  },
  {
    id: "route-types",
    title: "Типи маршрутів",
    hint: "Route types",
    type: "list",
    content: lines(companyProfile.routeTypes),
  },
  {
    id: "business-facts",
    title: "Факти про бізнес",
    hint: "Structured business facts",
    type: "list",
    content: lines([
      `Автопарк: ${companyProfile.businessFacts.fleetSize} автомобілів`,
      "Працює по Європі",
      "Трансфери до аеропортів",
      "Корпоративні перевезення",
      "Партнерська програма",
      "Оренда авто з водієм",
    ]),
    featured: true,
  },
];
