import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DayPlan, UserSettings, NutritionGoal, MealType, Nutrition } from "@/types";
import { getWeekStart, getWeekDates } from "@/utils/calculate";

interface PlanState {
  plans: Record<string, DayPlan>;
  settings: UserSettings;
  nutritionGoal: NutritionGoal;

  // プラン操作
  getPlan: (date: string) => DayPlan;
  addMeal: (date: string, mealType: MealType, recipeId: string) => void;
  removeMeal: (date: string, mealType: MealType, recipeId: string) => void;
  updatePlanNutrition: (date: string, nutrition: Nutrition) => void;

  // 週間プラン
  getWeekPlans: (startDate?: Date) => DayPlan[];

  // 設定操作
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateNutritionGoal: (goal: Partial<NutritionGoal>) => void;

  // テーマ
  toggleDarkMode: () => void;
}

const defaultSettings: UserSettings = {
  targetCalories: 2000,
  targetProtein: 60,
  targetFat: 55,
  targetCarbs: 250,
  darkMode: false,
};

const defaultGoal: NutritionGoal = {
  calories: 2000,
  protein: 60,
  fat: 55,
  carbs: 250,
  fiber: 20,
  sodium: 7,
};

const createEmptyPlan = (date: string, targetCalories: number): DayPlan => ({
  date,
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
  targetCalories,
});

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      plans: {},
      settings: defaultSettings,
      nutritionGoal: defaultGoal,

      getPlan: (date) => {
        const { plans, settings } = get();
        return plans[date] || createEmptyPlan(date, settings.targetCalories);
      },

      addMeal: (date, mealType, recipeId) => {
        set((state) => {
          const plan = state.plans[date] || createEmptyPlan(date, state.settings.targetCalories);
          return {
            plans: {
              ...state.plans,
              [date]: {
                ...plan,
                meals: {
                  ...plan.meals,
                  [mealType]: [...plan.meals[mealType], recipeId],
                },
              },
            },
          };
        });
      },

      removeMeal: (date, mealType, recipeId) => {
        set((state) => {
          const plan = state.plans[date];
          if (!plan) return state;
          const meals = plan.meals[mealType];
          const index = meals.indexOf(recipeId);
          if (index === -1) return state;
          return {
            plans: {
              ...state.plans,
              [date]: {
                ...plan,
                meals: {
                  ...plan.meals,
                  [mealType]: meals.filter((_, i) => i !== index),
                },
              },
            },
          };
        });
      },

      updatePlanNutrition: (date, nutrition) => {
        set((state) => {
          const plan = state.plans[date];
          if (!plan) return state;
          return {
            plans: {
              ...state.plans,
              [date]: {
                ...plan,
                actualNutrition: nutrition,
              },
            },
          };
        });
      },

      getWeekPlans: (startDate = new Date()) => {
        const weekStart = getWeekStart(startDate);
        const dates = getWeekDates(weekStart);
        return dates.map((date) => get().getPlan(date));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      updateNutritionGoal: (goal) => {
        set((state) => ({
          nutritionGoal: { ...state.nutritionGoal, ...goal },
        }));
      },

      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.settings.darkMode;
          if (newDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return {
            settings: { ...state.settings, darkMode: newDarkMode },
          };
        });
      },
    }),
    {
      name: "plan-storage",
      onRehydrateStorage: () => (state) => {
        // ダークモードの復元
        if (state?.settings.darkMode) {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);
