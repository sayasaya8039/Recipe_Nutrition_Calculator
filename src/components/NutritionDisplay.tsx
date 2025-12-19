import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRecipeStore } from "@/stores/recipeStore";
import { usePlanStore } from "@/stores/planStore";
import { calculatePFCBalance, calculateProgress } from "@/utils/calculate";
import type { Nutrition } from "@/types";

interface NutritionDisplayProps {
  nutrition?: Nutrition;
  showGoalProgress?: boolean;
  compact?: boolean;
}

export function NutritionDisplay({
  nutrition: propNutrition,
  showGoalProgress = false,
  compact = false,
}: NutritionDisplayProps) {
  const { getCurrentNutrition } = useRecipeStore();
  const { nutritionGoal } = usePlanStore();

  const nutrition = propNutrition || getCurrentNutrition();
  const pfcBalance = useMemo(() => calculatePFCBalance(nutrition), [nutrition]);

  const nutrients = [
    { key: "calories", label: "カロリー", value: nutrition.calories, unit: "kcal", color: "bg-accent" },
    { key: "protein", label: "タンパク質", value: nutrition.protein, unit: "g", color: "bg-success" },
    { key: "fat", label: "脂質", value: nutrition.fat, unit: "g", color: "bg-warning" },
    { key: "carbs", label: "炭水化物", value: nutrition.carbs, unit: "g", color: "bg-error" },
    { key: "fiber", label: "食物繊維", value: nutrition.fiber, unit: "g", color: "bg-green-400" },
    { key: "sodium", label: "塩分", value: nutrition.sodium, unit: "g", color: "bg-purple-400" },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-sub-background">
          <div className="text-lg font-bold text-accent">{nutrition.calories}</div>
          <div className="text-xs text-sub-text">kcal</div>
        </div>
        <div className="p-2 rounded-lg bg-sub-background">
          <div className="text-lg font-bold text-success">{nutrition.protein}g</div>
          <div className="text-xs text-sub-text">P</div>
        </div>
        <div className="p-2 rounded-lg bg-sub-background">
          <div className="text-lg font-bold text-warning">{nutrition.fat}g</div>
          <div className="text-xs text-sub-text">F</div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>栄養成分</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* メイン栄養素 */}
        <div className="grid gap-3">
          {nutrients.map((n) => {
            const goal = nutritionGoal[n.key as keyof typeof nutritionGoal];
            const progress = showGoalProgress ? calculateProgress(n.value, goal) : 0;

            return (
              <div key={n.key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text">{n.label}</span>
                  <span className="font-medium text-text">
                    {n.value}
                    {n.unit}
                    {showGoalProgress && (
                      <span className="text-sub-text ml-1">
                        / {goal}
                        {n.unit}
                      </span>
                    )}
                  </span>
                </div>
                {showGoalProgress && (
                  <div className="h-2 rounded-full bg-sub-background overflow-hidden">
                    <div
                      className={`h-full ${n.color} transition-all duration-300`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PFCバランス */}
        <div className="pt-4 border-t border-sub-background">
          <h4 className="text-sm font-medium text-text mb-2">PFCバランス</h4>
          <div className="flex h-4 rounded-full overflow-hidden">
            <div
              className="bg-success transition-all duration-300"
              style={{ width: `${pfcBalance.protein}%` }}
              title={`P: ${pfcBalance.protein}%`}
            />
            <div
              className="bg-warning transition-all duration-300"
              style={{ width: `${pfcBalance.fat}%` }}
              title={`F: ${pfcBalance.fat}%`}
            />
            <div
              className="bg-error transition-all duration-300"
              style={{ width: `${pfcBalance.carbs}%` }}
              title={`C: ${pfcBalance.carbs}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-sub-text mt-1">
            <span>P: {pfcBalance.protein}%</span>
            <span>F: {pfcBalance.fat}%</span>
            <span>C: {pfcBalance.carbs}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
