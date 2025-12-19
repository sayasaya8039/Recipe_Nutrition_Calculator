// 栄養素の型
export interface Nutrition {
  calories: number;    // カロリー (kcal)
  protein: number;     // タンパク質 (g)
  fat: number;         // 脂質 (g)
  carbs: number;       // 炭水化物 (g)
  fiber: number;       // 食物繊維 (g)
  sodium: number;      // 塩分 (g)
}

// 食品の型
export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  unit: string;
  defaultAmount: number;
  nutrition: Nutrition;  // 100gあたりの栄養素
}

// 食品カテゴリ
export type FoodCategory = 
  | "穀類"
  | "野菜"
  | "果物"
  | "肉類"
  | "魚介類"
  | "卵・乳製品"
  | "豆類"
  | "調味料"
  | "飲料"
  | "その他";

// 材料（レシピ内での食品と分量）
export interface Ingredient {
  foodId: string;
  amount: number;      // グラム数
  food?: Food;         // 参照用
}

// レシピの型
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  totalNutrition: Nutrition;
  servings: number;    // 何人前か
  createdAt: string;
  updatedAt: string;
}

// 食事タイプ
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// 1日の食事プラン
export interface DayPlan {
  date: string;        // YYYY-MM-DD形式
  meals: {
    breakfast: string[];  // レシピIDの配列
    lunch: string[];
    dinner: string[];
    snack: string[];
  };
  targetCalories: number;
  actualNutrition?: Nutrition;
}

// ユーザー設定
export interface UserSettings {
  targetCalories: number;
  targetProtein: number;
  targetFat: number;
  targetCarbs: number;
  darkMode: boolean;
}

// 栄養目標（日次）
export interface NutritionGoal {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sodium: number;
}
