import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePlanStore } from "@/stores/planStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { getWeekStart, getWeekDates, formatDate } from "@/utils/calculate";
import type { MealType } from "@/types";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "朝食",
  lunch: "昼食",
  dinner: "夕食",
  snack: "間食",
};

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

interface PlanCalendarProps {
  onAddMeal?: (date: string, mealType: MealType) => void;
}

export function PlanCalendar({ onAddMeal }: PlanCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getPlan } = usePlanStore();
  const { getRecipe } = useRecipeStore();

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = formatDate(new Date());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>週間プラン</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={goToToday}>
            今週
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="w-16 p-2 text-left text-sub-text font-medium"></th>
                {weekDates.map((date, i) => {
                  const isToday = date === today;
                  const d = new Date(date);
                  return (
                    <th
                      key={date}
                      className={`p-2 text-center ${
                        isToday ? "bg-accent/20 rounded-t-lg" : ""
                      }`}
                    >
                      <div className="text-xs text-sub-text">{DAY_LABELS[i]}</div>
                      <div
                        className={`text-lg font-medium ${
                          isToday ? "text-accent" : "text-text"
                        }`}
                      >
                        {d.getDate()}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(MEAL_LABELS) as MealType[]).map((mealType) => (
                <tr key={mealType}>
                  <td className="p-2 text-sm text-sub-text font-medium">
                    {MEAL_LABELS[mealType]}
                  </td>
                  {weekDates.map((date) => {
                    const plan = getPlan(date);
                    const mealRecipeIds = plan.meals[mealType];
                    const isToday = date === today;

                    return (
                      <td
                        key={date}
                        className={`p-1 align-top ${
                          isToday ? "bg-accent/10" : ""
                        }`}
                      >
                        <div className="min-h-[60px] space-y-1">
                          {mealRecipeIds.map((recipeId, idx) => {
                            const recipe = getRecipe(recipeId);
                            if (!recipe) return null;
                            return (
                              <div
                                key={`${recipeId}-${idx}`}
                                className="text-xs p-1 rounded bg-sub-background truncate"
                                title={recipe.name}
                              >
                                {recipe.name}
                              </div>
                            );
                          })}
                          {onAddMeal && (
                            <button
                              onClick={() => onAddMeal(date, mealType)}
                              className="w-full p-1 text-xs text-sub-text hover:text-accent hover:bg-sub-background rounded transition-colors flex items-center justify-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
