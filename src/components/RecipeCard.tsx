import { Trash2, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NutritionDisplay } from "./NutritionDisplay";
import type { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
  onClick?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onEdit, onDelete, onClick }: RecipeCardProps) {
  return (
    <Card
      className={onClick ? "cursor-pointer hover:shadow-md" : ""}
      onClick={() => onClick?.(recipe)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{recipe.name}</CardTitle>
        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(recipe);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recipe.description && (
          <p className="text-sm text-sub-text mb-3">{recipe.description}</p>
        )}
        <NutritionDisplay nutrition={recipe.totalNutrition} compact />
        <div className="mt-2 text-xs text-sub-text">
          {recipe.servings}人前 / {recipe.ingredients.length}材料
        </div>
      </CardContent>
    </Card>
  );
}
