import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { usePlanStore } from "@/stores/planStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { sumNutrition } from "@/utils/calculate";

const COLORS = {
  calories: "#7DD3FC",
  protein: "#A7F3D0",
  fat: "#FDE68A",
  carbs: "#FECACA",
};

export function ProgressChart() {
  const { getWeekPlans, nutritionGoal } = usePlanStore();
  const { getRecipe } = useRecipeStore();

  const weekData = useMemo(() => {
    const plans = getWeekPlans();
    const dayLabels = ["月", "火", "水", "木", "金", "土", "日"];

    return plans.map((plan, i) => {
      // プラン内のすべてのレシピの栄養を合算
      const allRecipeIds = [
        ...plan.meals.breakfast,
        ...plan.meals.lunch,
        ...plan.meals.dinner,
        ...plan.meals.snack,
      ];

      const nutritions = allRecipeIds
        .map((id) => getRecipe(id)?.totalNutrition)
        .filter((n): n is NonNullable<typeof n> => n !== undefined);

      const total = sumNutrition(nutritions);

      return {
        day: dayLabels[i],
        calories: total.calories,
        protein: total.protein,
        fat: total.fat,
        carbs: total.carbs,
        target: nutritionGoal.calories,
      };
    });
  }, [getWeekPlans, getRecipe, nutritionGoal]);

  const pfcData = useMemo(() => {
    const total = weekData.reduce(
      (acc, day) => ({
        protein: acc.protein + day.protein,
        fat: acc.fat + day.fat,
        carbs: acc.carbs + day.carbs,
      }),
      { protein: 0, fat: 0, carbs: 0 }
    );

    return [
      { name: "タンパク質", value: total.protein, color: COLORS.protein },
      { name: "脂質", value: total.fat, color: COLORS.fat },
      { name: "炭水化物", value: total.carbs, color: COLORS.carbs },
    ];
  }, [weekData]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* カロリー推移 */}
      <Card>
        <CardHeader>
          <CardTitle>週間カロリー推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-secondary)" />
                <XAxis dataKey="day" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--bg-secondary)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke={COLORS.calories}
                  fill={COLORS.calories}
                  fillOpacity={0.3}
                  name="カロリー"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#64748B"
                  strokeDasharray="5 5"
                  fill="none"
                  name="目標"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* PFCバランス */}
      <Card>
        <CardHeader>
          <CardTitle>週間PFCバランス</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pfcData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pfcData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--bg-secondary)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${(value as number).toFixed(1)}g`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
