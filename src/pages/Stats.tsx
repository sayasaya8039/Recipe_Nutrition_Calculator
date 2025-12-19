import { ProgressChart } from "@/components/ProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { usePlanStore } from "@/stores/planStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { sumNutrition, getToday } from "@/utils/calculate";

export function Stats() {
  const { getPlan, nutritionGoal } = usePlanStore();
  const { getRecipe } = useRecipeStore();

  // 今日の栄養摂取量を計算
  const todayPlan = getPlan(getToday());
  const todayRecipeIds = [
    ...todayPlan.meals.breakfast,
    ...todayPlan.meals.lunch,
    ...todayPlan.meals.dinner,
    ...todayPlan.meals.snack,
  ];

  const todayNutrition = sumNutrition(
    todayRecipeIds
      .map((id) => getRecipe(id)?.totalNutrition)
      .filter((n): n is NonNullable<typeof n> => n !== undefined)
  );

  return (
    <div className="space-y-6">
      {/* 今日のサマリー */}
      <Card>
        <CardHeader>
          <CardTitle>今日の摂取状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-sub-background">
              <div className="text-2xl font-bold text-accent">
                {todayNutrition.calories}
              </div>
              <div className="text-xs text-sub-text">
                / {nutritionGoal.calories} kcal
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-sub-background">
              <div className="text-2xl font-bold text-success">
                {todayNutrition.protein}g
              </div>
              <div className="text-xs text-sub-text">
                / {nutritionGoal.protein}g タンパク質
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-sub-background">
              <div className="text-2xl font-bold text-warning">
                {todayNutrition.fat}g
              </div>
              <div className="text-xs text-sub-text">
                / {nutritionGoal.fat}g 脂質
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-sub-background">
              <div className="text-2xl font-bold text-error">
                {todayNutrition.carbs}g
              </div>
              <div className="text-xs text-sub-text">
                / {nutritionGoal.carbs}g 炭水化物
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 週間グラフ */}
      <ProgressChart />
    </div>
  );
}
