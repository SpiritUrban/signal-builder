import type { RoadmapCategory, RoadmapItem } from "@/lib/types";

const levels: { category: RoadmapCategory; names: string[] }[] = [
  { category: "Карти", names: ["Google Business Profile", "Bing Places", "Apple Business Connect", "HERE Maps", "TomTom Places", "OpenStreetMap", "Waze Business"] },
  { category: "Соцмережі", names: ["Facebook Page", "Instagram", "TikTok", "YouTube", "LinkedIn Company Page"] },
  { category: "Каталоги", names: ["Hotfrog", "Brownbook", "Cylex", "MisterWhat", "Tupalo", "Fyple", "Yellow.Place", "Callupcontact", "ShowMeLocal", "Where2Go", "ChamberofCommerce", "Yalwa"] },
  { category: "Оголошення", names: ["OLX", "Flagma", "Obyava.ua", "Ukrboard", "Bizator", "RIA", "Besplatka", "Uainfo", "Prom.ua"] },
  { category: "Ресурси", names: ["Visit Ukraine", "Форуми українців у Польщі", "Сайти про роботу в Польщі", "Сайти про переїзд до Польщі", "Туристичні блоги", "Блоги про подорожі Польщею", "Блоги про аеропорти Польщі"] },
  { category: "Спільноти", names: ["Українці у Варшаві", "Українці в Польщі", "Хелм", "Варшава", "Перемишль", "Люблін", "Медика", "Кордон Польща Україна", "Ягодин", "Шегині", "Telegram: Українці у Польщі", "Telegram: Варшава", "Telegram: Хелм", "Telegram: Люблін", "Telegram: Робота Польща", "Telegram: Кордон Польща", "Telegram: Подорожі Польща"] },
  { category: "ЗМІ", names: ["0382.ua", "20minut.ua", "0432.ua", "0352.ua", "0342.ua", "0332.ua", "0362.ua", "0412.ua", "0472.ua", "0532.ua", "057.ua", "032.ua", "056.ua", "048.ua", "Telegraf", "OBOZ", "УНІАН", "РБК Україна", "Фокус", "ЛІГА", "NV", "Кореспондент", "Новини LIVE"] },
  { category: "Платформи", names: ["Reddit", "Quora", "Medium", "LinkedIn Articles", "Blogger", "Tumblr", "WordPress.com", "Substack"] },
  { category: "Контент", names: ["YouTube Shorts", "TikTok відео", "Instagram Reels", "Facebook Reels", "Статті на сайті My Transfer", "FAQ сторінки", "Маршрутні сторінки", "Сторінки міст", "Сторінки аеропортів"] },
  { category: "Відгуки", names: ["Google Reviews", "Facebook Reviews", "Trustpilot", "Cylex Reviews", "Hotfrog Reviews"] },
];

const description = "My Transfer — індивідуальні трансфери між містами Польщі, аеропортами та кордоном. Комфортні авто, без пересадок, 24/7.";

export const initialRoadmap: RoadmapItem[] = levels.flatMap((group, level) =>
  group.names.map((title) => {
    const id = levels.slice(0, level).reduce((sum, item) => sum + item.names.length, 0) + group.names.indexOf(title) + 1;
    return {
      id,
      title,
      category: group.category,
      level: level + 1,
      priority: id <= 30 ? "high" : id <= 60 ? "medium" : "low",
      status: "planned",
      url: "",
      targetUrl: "",
      seoValue: Math.max(2, 6 - Math.ceil((level + 1) / 2)),
      difficulty: Math.min(5, 1 + Math.floor(level / 2)),
      recommendedText: description,
      notes: "",
      updatedAt: "",
    } satisfies RoadmapItem;
  }),
);
