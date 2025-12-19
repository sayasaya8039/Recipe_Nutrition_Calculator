import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useRecipeStore } from "@/stores/recipeStore";
import type { Food } from "@/types";

export function IngredientInput() {
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { searchFoods, addIngredient, currentIngredients, removeIngredient, getFoodById } =
    useRecipeStore();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchFoods(query).slice(0, 10);
  }, [query, searchFoods]);

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setAmount(food.defaultAmount.toString());
    setQuery(food.name);
    setIsOpen(false);
  };

  const handleAddIngredient = () => {
    if (!selectedFood || !amount) return;
    addIngredient({
      foodId: selectedFood.id,
      amount: parseFloat(amount),
    });
    setQuery("");
    setSelectedFood(null);
    setAmount("");
  };

  return (
    <div className="space-y-4">
      {/* 検索入力 */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sub-text" />
          <Input
            placeholder="食材を検索..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedFood(null);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />
        </div>

        {/* 検索結果ドロップダウン */}
        {isOpen && searchResults.length > 0 && (
          <Card className="absolute z-10 mt-1 w-full max-h-60 overflow-auto">
            <CardContent className="p-1">
              {searchResults.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-sub-background transition-colors"
                >
                  <div className="font-medium text-text">{food.name}</div>
                  <div className="text-xs text-sub-text">
                    {food.category} / {food.nutrition.calories}kcal/100g
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 分量入力 */}
      {selectedFood && (
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="分量"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
            />
          </div>
          <span className="text-sub-text">{selectedFood.unit}</span>
          <Button onClick={handleAddIngredient}>
            <Plus className="h-4 w-4" />
            追加
          </Button>
        </div>
      )}

      {/* 追加済み材料リスト */}
      {currentIngredients.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-text">追加した材料</h4>
          {currentIngredients.map((ing) => {
            const food = getFoodById(ing.foodId);
            if (!food) return null;
            return (
              <div
                key={ing.foodId}
                className="flex items-center justify-between p-2 rounded-lg bg-sub-background"
              >
                <div>
                  <span className="font-medium text-text">{food.name}</span>
                  <span className="text-sub-text ml-2">
                    {ing.amount}
                    {food.unit}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ing.foodId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
