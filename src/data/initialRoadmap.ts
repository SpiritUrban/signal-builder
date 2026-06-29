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

const serviceUrls: Record<string, string> = {
  "Google Business Profile": "https://business.google.com/",
  "Bing Places": "https://www.bingplaces.com/",
  "Apple Business Connect": "https://businessconnect.apple.com/",
  "HERE Maps": "https://mapcreator.here.com/",
  "TomTom Places": "https://www.tomtom.com/mapshare/tools/",
  OpenStreetMap: "https://www.openstreetmap.org/",
  "Waze Business": "https://www.waze.com/business/",
  "Facebook Page": "https://www.facebook.com/pages/create/",
  Instagram: "https://www.instagram.com/",
  TikTok: "https://www.tiktok.com/",
  YouTube: "https://www.youtube.com/",
  "LinkedIn Company Page": "https://www.linkedin.com/company/setup/new/",
  Hotfrog: "https://www.hotfrog.com/",
  Brownbook: "https://www.brownbook.net/",
  Cylex: "https://www.cylex-polska.pl",
  MisterWhat: "https://www.misterwhat.com/",
  Tupalo: "https://tupalo.com/",
  Fyple: "https://www.fyple.com/",
  "Yellow.Place": "https://yellow.place/",
  Callupcontact: "https://www.callupcontact.com/",
  ShowMeLocal: "https://www.showmelocal.com/",
  Where2Go: "https://www.where2go.com/",
  ChamberofCommerce: "https://www.chamberofcommerce.com/",
  Yalwa: "https://www.yalwa.com/",
  OLX: "https://www.olx.ua/",
  Flagma: "https://flagma.ua/",
  "Obyava.ua": "https://obyava.ua/",
  Ukrboard: "https://www.ukrboard.com.ua/",
  Bizator: "https://bizator.ua/",
  RIA: "https://www.ria.com/",
  Besplatka: "https://besplatka.ua/",
  Uainfo: "https://uainfo.org/",
  "Prom.ua": "https://prom.ua/",
  "Visit Ukraine": "https://visitukraine.today/",
  Reddit: "https://www.reddit.com/",
  Quora: "https://www.quora.com/",
  Medium: "https://medium.com/",
  "LinkedIn Articles": "https://www.linkedin.com/",
  Blogger: "https://www.blogger.com/",
  Tumblr: "https://www.tumblr.com/",
  "WordPress.com": "https://wordpress.com/",
  Substack: "https://substack.com/",
  "YouTube Shorts": "https://www.youtube.com/shorts/",
  "TikTok відео": "https://www.tiktok.com/",
  "Instagram Reels": "https://www.instagram.com/reels/",
  "Facebook Reels": "https://www.facebook.com/reel/",
  "Статті на сайті My Transfer": "https://my-transfer.com.ua/",
  "FAQ сторінки": "https://my-transfer.com.ua/",
  "Маршрутні сторінки": "https://my-transfer.com.ua/",
  "Сторінки міст": "https://my-transfer.com.ua/",
  "Сторінки аеропортів": "https://my-transfer.com.ua/",
  "Google Reviews": "https://business.google.com/",
  "Facebook Reviews": "https://www.facebook.com/",
  Trustpilot: "https://www.trustpilot.com/",
  "Cylex Reviews": "https://www.cylex-polska.pl",
  "Hotfrog Reviews": "https://www.hotfrog.com/",
  Telegraf: "https://telegraf.com.ua/",
  OBOZ: "https://www.obozrevatel.com/",
  УНІАН: "https://www.unian.ua/",
  "РБК Україна": "https://www.rbc.ua/",
  Фокус: "https://focus.ua/",
  ЛІГА: "https://www.liga.net/",
  NV: "https://nv.ua/",
  Кореспондент: "https://korrespondent.net/",
  "Новини LIVE": "https://novyny.live/",
};

function getServiceUrl(title: string) {
  if (serviceUrls[title]) return serviceUrls[title];
  if (/^\d{3,4}\.ua$/.test(title)) return `https://${title}/`;
  return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
}

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
      url: getServiceUrl(title),
      targetUrl: "",
      seoValue: Math.max(2, 6 - Math.ceil((level + 1) / 2)),
      difficulty: Math.min(5, 1 + Math.floor(level / 2)),
      recommendedText: description,
      notes: "",
      updatedAt: "",
    } satisfies RoadmapItem;
  }),
);
