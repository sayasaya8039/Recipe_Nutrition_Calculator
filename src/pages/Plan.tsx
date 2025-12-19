import { useState } from "react";
import { X } from "lucide-react";
import { PlanCalendar } from "@/components/PlanCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRecipeStore } from "@/stores/recipeStore";
import { usePlanStore } from "@/stores/planStore";
import type { MealType } from "@/types";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "朝食",
  lunch: "昼食",
  dinner: "夕食",
  snack: "間食",
};

export function Plan() {
  const [modal, setModal] = useState<{
    date: string;
    mealType: MealType;
  } | null>(null);

  const { recipes } = useRecipeStore();
  const { addMeal } = usePlanStore();

  const handleAddMeal = (date: string, mealType: MealType) => {
    setModal({ date, mealType });
  };

  const handleSelectRecipe = (recipeId: string) => {
    if (!modal) return;
    addMeal(modal.date, modal.mealType, recipeId);
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <PlanCalendar onAddMeal={handleAddMeal} />

      {/* レシピ選択モーダル */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {new Date(modal.date).toLocaleDateString("ja-JP", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                {MEAL_LABELS[modal.mealType]}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setModal(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1">
              {recipes.length === 0 ? (
                <p className="text-center text-sub-text py-8">
                  レシピがありません。<br />
                  まずはレシピを作成してください。
                </p>
              ) : (
                <div className="space-y-2">
                  {recipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => handleSelectRecipe(recipe.id)}
                      className="w-full text-left p-3 rounded-lg bg-sub-background hover:bg-accent/10 transition-colors"
                    >
                      <div className="font-medium text-text">{recipe.name}</div>
                      <div className="text-xs text-sub-text">
                        {recipe.totalNutrition.calories}kcal / P
                        {recipe.totalNutrition.protein}g / F
                        {recipe.totalNutrition.fat}g / C
                        {recipe.totalNutrition.carbs}g
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
