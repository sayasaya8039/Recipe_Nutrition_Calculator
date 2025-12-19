import { useState } from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IngredientInput } from "@/components/IngredientInput";
import { NutritionDisplay } from "@/components/NutritionDisplay";
import { MealSuggestion } from "@/components/MealSuggestion";
import { useRecipeStore } from "@/stores/recipeStore";

export function Home() {
  const [recipeName, setRecipeName] = useState("");
  const [servings, setServings] = useState("1");
  const { addRecipe, clearIngredients, currentIngredients } = useRecipeStore();

  const handleSaveRecipe = () => {
    if (!recipeName.trim() || currentIngredients.length === 0) return;

    addRecipe({
      name: recipeName,
      ingredients: currentIngredients,
      servings: parseInt(servings) || 1,
    });

    setRecipeName("");
    setServings("1");
    clearIngredients();
  };

  return (
    <div className="space-y-6">
      {/* メイン計算エリア */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 材料入力 */}
        <Card>
          <CardHeader>
            <CardTitle>材料を追加</CardTitle>
          </CardHeader>
          <CardContent>
            <IngredientInput />
          </CardContent>
        </Card>

        {/* 栄養表示 */}
        <NutritionDisplay showGoalProgress />
      </div>

      {/* レシピ保存 */}
      {currentIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>レシピとして保存</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="レシピ名"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="人前"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  min="1"
                  className="w-20"
                />
                <span className="text-sub-text">人前</span>
              </div>
              <Button onClick={handleSaveRecipe} disabled={!recipeName.trim()}>
                <Save className="h-4 w-4" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* おすすめ */}
      <MealSuggestion />
    </div>
  );
}
