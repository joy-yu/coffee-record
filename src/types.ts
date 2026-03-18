// ---- 口感评分 ----
export interface TasteScores {
  acidity: number;
  sweetness: number;
  bitterness: number;
  body: number;
  aroma: number;
  finish: number;
}

// ---- 完整咖啡冲煮记录 ----
export interface CoffeeRecord {
  id: string;
  createdAt: string;
  updatedAt?: string;

  // Step 1 · 冲煮参数
  beanName: string;
  origin: string;
  roastLevel: string;
  process: string;
  brewMethod: string;
  grindSize: number | string;
  coffeeAmount: number | string;
  waterAmount: number | string;
  waterTemp: number | string;
  bloomWater: number | string;
  bloomTime: number | string;
  brewTime: number | string;

  // Step 2 · 环境 & 器具
  brewDate: string;
  weather: string;
  temperature: number | string;
  humidity: number | string;
  grinderBrand: string;
  kettleBrand: string;
  dripperBrand: string;
  beanPrice: number | string;
  priceRating: number;

  // Step 3 · 口感 & 心得
  taste: TasteScores;
  flavors: string[];
  rating: number;
  notes: string;
  photo: string | null;
}

// ---- Context 暴露的 store 类型 ----
export interface CoffeeStore {
  records: CoffeeRecord[];
  addRecord: (record: Omit<CoffeeRecord, 'id' | 'createdAt'>) => string;
  updateRecord: (id: string, updates: Partial<CoffeeRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecord: (id: string) => CoffeeRecord | undefined;
}
