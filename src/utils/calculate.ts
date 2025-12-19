import type { Nutrition, Ingredient, Food } from "@/types";

// 空の栄養素オブジェクト
export const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  fiber: 0,
  sodium: 0,
};

// 食品の栄養素を分量に基づいて計算（100gあたり → 実際の分量）
export function calculateNutrition(food: Food, amount: number): Nutrition {
  const ratio = amount / 100;
  return {
    calories: Math.round(food.nutrition.calories * ratio * 10) / 10,
    protein: Math.round(food.nutrition.protein * ratio * 10) / 10,
    fat: Math.round(food.nutrition.fat * ratio * 10) / 10,
    carbs: Math.round(food.nutrition.carbs * ratio * 10) / 10,
    fiber: Math.round(food.nutrition.fiber * ratio * 10) / 10,
    sodium: Math.round(food.nutrition.sodium * ratio * 100) / 100,
  };
}

// 複数の栄養素を合算
export function sumNutrition(nutritions: Nutrition[]): Nutrition {
  return nutritions.reduce(
    (acc, n) => ({
      calories: Math.round((acc.calories + n.calories) * 10) / 10,
      protein: Math.round((acc.protein + n.protein) * 10) / 10,
      fat: Math.round((acc.fat + n.fat) * 10) / 10,
      carbs: Math.round((acc.carbs + n.carbs) * 10) / 10,
      fiber: Math.round((acc.fiber + n.fiber) * 10) / 10,
      sodium: Math.round((acc.sodium + n.sodium) * 100) / 100,
    }),
    { ...emptyNutrition }
  );
}

// 材料リストから合計栄養素を計算
export function calculateTotalNutrition(
  ingredients: Ingredient[],
  foods: Food[]
): Nutrition {
  const nutritions = ingredients.map((ing) => {
    const food = foods.find((f) => f.id === ing.foodId);
    if (!food) return emptyNutrition;
    return calculateNutrition(food, ing.amount);
  });
  return sumNutrition(nutritions);
}

// PFCバランスを計算（%）
export function calculatePFCBalance(nutrition: Nutrition): {
  protein: number;
  fat: number;
  carbs: number;
} {
  const proteinCal = nutrition.protein * 4;
  const fatCal = nutrition.fat * 9;
  const carbsCal = nutrition.carbs * 4;
  const total = proteinCal + fatCal + carbsCal;

  if (total === 0) {
    return { protein: 0, fat: 0, carbs: 0 };
  }

  return {
    protein: Math.round((proteinCal / total) * 100),
    fat: Math.round((fatCal / total) * 100),
    carbs: Math.round((carbsCal / total) * 100),
  };
}

// 目標に対する達成率を計算（%）
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

// 日付をYYYY-MM-DD形式でフォーマット
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// 今日の日付を取得
export function getToday(): string {
  return formatDate(new Date());
}

// 週の開始日を取得（月曜始まり）
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// 週の日付リストを取得
export function getWeekDates(startDate: Date): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}
