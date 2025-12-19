import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe, Ingredient, Food, Nutrition } from "@/types";
import { calculateTotalNutrition } from "@/utils/calculate";
import foodsData from "@/data/foods.json";

interface RecipeState {
  recipes: Recipe[];
  foods: Food[];
  currentIngredients: Ingredient[];

  // レシピ操作
  addRecipe: (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "totalNutrition">) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipe: (id: string) => Recipe | undefined;

  // 材料操作
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (foodId: string, amount: number) => void;
  removeIngredient: (foodId: string) => void;
  clearIngredients: () => void;

  // 栄養計算
  getCurrentNutrition: () => Nutrition;

  // 食品検索
  searchFoods: (query: string) => Food[];
  getFoodById: (id: string) => Food | undefined;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: [],
      foods: foodsData.foods as Food[],
      currentIngredients: [],

      addRecipe: (recipeData) => {
        const { foods, currentIngredients } = get();
        const totalNutrition = calculateTotalNutrition(currentIngredients, foods);
        const now = new Date().toISOString();
        const newRecipe: Recipe = {
          ...recipeData,
          id: crypto.randomUUID(),
          ingredients: [...currentIngredients],
          totalNutrition,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ recipes: [...state.recipes, newRecipe] }));
      },

      updateRecipe: (id, recipeData) => {
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id
              ? { ...r, ...recipeData, updatedAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      deleteRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        }));
      },

      getRecipe: (id) => {
        return get().recipes.find((r) => r.id === id);
      },

      addIngredient: (ingredient) => {
        const existing = get().currentIngredients.find(
          (i) => i.foodId === ingredient.foodId
        );
        if (existing) {
          get().updateIngredient(
            ingredient.foodId,
            existing.amount + ingredient.amount
          );
        } else {
          set((state) => ({
            currentIngredients: [...state.currentIngredients, ingredient],
          }));
        }
      },

      updateIngredient: (foodId, amount) => {
        set((state) => ({
          currentIngredients: state.currentIngredients.map((i) =>
            i.foodId === foodId ? { ...i, amount } : i
          ),
        }));
      },

      removeIngredient: (foodId) => {
        set((state) => ({
          currentIngredients: state.currentIngredients.filter(
            (i) => i.foodId !== foodId
          ),
        }));
      },

      clearIngredients: () => {
        set({ currentIngredients: [] });
      },

      getCurrentNutrition: () => {
        const { currentIngredients, foods } = get();
        return calculateTotalNutrition(currentIngredients, foods);
      },

      searchFoods: (query) => {
        const { foods } = get();
        if (!query.trim()) return foods;
        const lower = query.toLowerCase();
        return foods.filter(
          (f) =>
            f.name.toLowerCase().includes(lower) ||
            f.category.toLowerCase().includes(lower)
        );
      },

      getFoodById: (id) => {
        return get().foods.find((f) => f.id === id);
      },
    }),
    {
      name: "recipe-storage",
      partialize: (state) => ({
        recipes: state.recipes,
      }),
    }
  )
);
