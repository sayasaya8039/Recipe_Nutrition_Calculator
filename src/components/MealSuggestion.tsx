import { useMemo } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRecipeStore } from "@/stores/recipeStore";
import { usePlanStore } from "@/stores/planStore";
import { sumNutrition } from "@/utils/calculate";
import type { Recipe, Nutrition } from "@/types";

interface MealSuggestionProps {
  onSelectRecipe?: (recipe: Recipe) => void;
}

export function MealSuggestion({ onSelectRecipe }: MealSuggestionProps) {
  const { recipes } = useRecipeStore();
  const { nutritionGoal, getPlan } = usePlanStore();

  const suggestions = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayPlan = getPlan(today);

    // 今日の摂取済み栄養
    const consumedRecipeIds = [
      ...todayPlan.meals.breakfast,
      ...todayPlan.meals.lunch,
      ...todayPlan.meals.dinner,
      ...todayPlan.meals.snack,
    ];

    // レシピがない場合は空の提案
    if (recipes.length === 0) {
      return {
        remaining: nutritionGoal,
        suggested: [],
        message: "まずはレシピを作成してください",
      };
    }

    // 残りの栄養目標を計算
    const consumedNutritions = consumedRecipeIds
      .map((id) => recipes.find((r) => r.id === id)?.totalNutrition)
      .filter((n): n is Nutrition => n !== undefined);

    const consumed = sumNutrition(consumedNutritions);
    const remaining: Nutrition = {
      calories: Math.max(0, nutritionGoal.calories - consumed.calories),
      protein: Math.max(0, nutritionGoal.protein - consumed.protein),
      fat: Math.max(0, nutritionGoal.fat - consumed.fat),
      carbs: Math.max(0, nutritionGoal.carbs - consumed.carbs),
      fiber: Math.max(0, nutritionGoal.fiber - consumed.fiber),
      sodium: Math.max(0, nutritionGoal.sodium - consumed.sodium),
    };

    // 残りのカロリーに合うレシピを提案（±20%の範囲）
    const targetCalories = remaining.calories;
    const suggested = recipes
      .filter((r) => {
        const cal = r.totalNutrition.calories;
        return cal >= targetCalories * 0.3 && cal <= targetCalories * 0.8;
      })
      .sort((a, b) => {
        // タンパク質が多いほど優先
        return b.totalNutrition.protein - a.totalNutrition.protein;
      })
      .slice(0, 3);

    let message = "";
    if (remaining.calories <= 0) {
      message = "今日の目標カロリーは達成済みです！";
    } else if (remaining.protein > nutritionGoal.protein * 0.5) {
      message = "タンパク質が不足気味です。肉・魚・卵料理がおすすめ！";
    } else if (remaining.calories > nutritionGoal.calories * 0.7) {
      message = "まだまだ食べられます。バランスの良い食事を！";
    } else {
      message = "あと少しで目標達成！軽めの食事がおすすめです。";
    }

    return { remaining, suggested, message };
  }, [recipes, nutritionGoal, getPlan]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          今日のおすすめ
        </CardTitle>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* メッセージ */}
        <div className="p-3 rounded-lg bg-sub-background">
          <p className="text-sm text-text">{suggestions.message}</p>
        </div>

        {/* 残り栄養目標 */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-accent/10">
            <div className="text-lg font-bold text-accent">
              {Math.round(suggestions.remaining.calories)}
            </div>
            <div className="text-xs text-sub-text">残りkcal</div>
          </div>
          <div className="p-2 rounded-lg bg-success/10">
            <div className="text-lg font-bold text-success">
              {Math.round(suggestions.remaining.protein)}g
            </div>
            <div className="text-xs text-sub-text">残りP</div>
          </div>
          <div className="p-2 rounded-lg bg-warning/10">
            <div className="text-lg font-bold text-warning">
              {Math.round(suggestions.remaining.fat)}g
            </div>
            <div className="text-xs text-sub-text">残りF</div>
          </div>
        </div>

        {/* 提案レシピ */}
        {suggestions.suggested.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text">おすすめレシピ</h4>
            {suggestions.suggested.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onSelectRecipe?.(recipe)}
                className="w-full text-left p-3 rounded-lg bg-sub-background hover:bg-accent/10 transition-colors"
              >
                <div className="font-medium text-text">{recipe.name}</div>
                <div className="text-xs text-sub-text">
                  {recipe.totalNutrition.calories}kcal / P
                  {recipe.totalNutrition.protein}g
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
